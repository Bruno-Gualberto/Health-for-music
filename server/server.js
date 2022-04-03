const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../database/db");
const cookieSession = require("cookie-session");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const cookieSessionMiddleware = cookieSession({
    secret: process.env.SECRET || `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

const multer = require("multer");
const uidSafe = require("uid-safe");

const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(compression());

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", async (req, res) => {
    res.json({ userId: req.session.userId, doctor: req.session.doctor });
});

app.post("/add-doctor.json", async (req, res) => {
    // const query = await db.addDoctor();
    const query = await db.fakeLoginDoctor();
    const { rows } = query;
    req.session.userId = rows[0].id;
    req.session.doctor = rows[0].doctor;
    res.json(rows[0]);
});

app.post("/add-user.json", async (req, res) => {
    // const query = await db.addUser();
    const query = await db.fakeLoginUser();
    const { rows } = query;
    req.session.userId = rows[0].id;
    req.session.doctor = rows[0].doctor;
    res.json(rows[0]);
});

app.get("/user.json", async (req, res) => {
    try {
        const query = await db.getUserById(req.session.userId);
        const { rows } = query;
        return res.json(rows[0]);
    } catch (err) {
        console.log("error on GET user.json: ", err);
    }
});

app.get("/articles.json", async (req, res) => {
    try {
        const query = await db.getArticles();
        const { rows } = query;
        res.json(rows);
    } catch (err) {
        console.log("error on GET /articles.json: ", err);
    }
});

app.get("/all-articles.json", async (req, res) => {
    try {
        const query = await db.getAllArticles();
        const { rows } = query;
        res.json(rows);
    } catch (err) {
        console.log("error on GET /all-articles.json: ", err);
    }
});

app.get("/more-articles/:smallestId.json", async (req, res) => {
    try {
        const smallestId = parseInt(req.params.smallestId);
        const query = await db.getMoreArticles(smallestId);
        const { rows } = query;
        res.json(rows);
    } catch (err) {
        console.log("error on GET /more-articles/:smallestId.json: ", err);
    }
});

app.get("/more-all-articles/:smallestId.json", async (req, res) => {
    try {
        const smallestId = parseInt(req.params.smallestId);
        const query = await db.getMoreAllArticles(smallestId);
        const { rows } = query;
        res.json(rows);
    } catch (err) {
        console.log("error on GET /more-all-articles/:smallestId.json: ", err);
    }
});

app.get("/single-article/:articleId.json", async (req, res) => {
    try {
        const articleId = parseInt(req.params.articleId);
        const query = await db.getSingleArticle(articleId);
        const { rows } = query;
        res.json(rows[0]);
    } catch (err) {
        console.log("error on GET /single-article/:articleId.json", err);
    }
});

app.get("/doctor/:doctorId.json", async (req, res) => {
    try {
        const doctorId = parseInt(req.params.doctorId);
        const ownProfile =
            req.session.doctor && doctorId === req.session.userId;
        const query = await db.getDoctorById(doctorId);
        const { rows } = query;
        return res.json({ doctorInfo: rows[0], ownProfile });
    } catch (err) {
        console.log("error on GET /doctor/:doctorId.json", err);
    }
});

app.get("/doctor-articles/:doctorId.json", async (req, res) => {
    try {
        const doctorId = parseInt(req.params.doctorId);
        const query = await db.getDoctorArticles(doctorId);
        const { rows } = query;
        res.json(rows);
    } catch (err) {
        console.log("error on GET /doctor-articles/:doctorId.json", err);
    }
});

app.get(
    "/more-doctor-articles/:doctorId/:smallestId.json",
    async (req, res) => {
        try {
            const smallestId = parseInt(req.params.smallestId);
            const doctorId = parseInt(req.params.doctorId);
            const query = await db.getMoreDoctorArticles(doctorId, smallestId);
            const { rows } = query;
            res.json(rows);
        } catch (err) {
            console.log(
                "error on GET /more-doctor-articles/:doctorId/:smallestId.json",
                err
            );
        }
    }
);

function hasAllFields(req, res, next) {
    let { title, subtitle, text } = req.body;
    if (!title || !subtitle || !text) {
        return res.json({
            error: "You must fill in all fields to publish an article.",
        });
    } else {
        next();
    }
}

app.post(
    "/add-new-article.json",
    uploader.single("file"),
    hasAllFields,
    s3.upload,
    async (req, res) => {
        let { title, subtitle, text } = req.body;
        const sanitizedText = DOMPurify.sanitize(text);

        // title, subtitle and text are in req.body
        let url = `https://s3.amazonaws.com/buckethealthformusic/${req.file.filename}`;
        // the url must be:
        // `https://s3.amazonaws.com/Name-BUCKET/${req.file.filename}`
        try {
            const query = await db.addArticle(
                req.session.userId,
                title,
                subtitle,
                sanitizedText,
                url
            );
            const { rows } = query;
            return res.json(rows[0]);
        } catch (err) {
            console.log("error on POST /add-new-article.json", err);
            return res.sendStatus(500);
        }
    }
);

app.get("/edit-article/:articleId", async (req, res) => {
    const articleId = parseInt(req.params.articleId);

    try {
        const query = await db.getArticleForEdit(articleId);
        const { rows } = query;
        res.json(rows[0]);
    } catch (err) {
        console.log("error on GET /edit-article/:articleId", err);
    }
});

app.post(
    "/edit-article-with-pic.json",
    uploader.single("file"),
    hasAllFields,
    s3.upload,
    async (req, res) => {
        let { title, subtitle, text } = req.body;
        const articleId = parseInt(req.body.articleId);
        const sanitizedText = DOMPurify.sanitize(text);

        let url = `https://s3.amazonaws.com/buckethealthformusic/${req.file.filename}`;
        try {
            const query = await db.updateArticleWithPic(
                articleId,
                title,
                subtitle,
                sanitizedText,
                url
            );
            const { rows } = query;
            return res.json(rows[0]);
        } catch (err) {
            console.log("error on POST /edit-article-with-pic.json", err);
            return res.sendStatus(500);
        }
    }
);

app.post("/edit-article-text.json", hasAllFields, async (req, res) => {
    let { title, subtitle, text, articleId } = req.body;
    articleId = parseInt(articleId);
    const sanitizedText = DOMPurify.sanitize(text);

    try {
        const query = await db.updateArticleText(
            articleId,
            title,
            subtitle,
            sanitizedText
        );
        const { rows } = query;
        return res.json(rows[0]);
    } catch (err) {
        console.log("error on POST /edit-article-text.json", err);
        return res.sendStatus(500);
    }
});

function hasAllProfileFields(req, res, next) {
    let {
        first,
        last,
        specialties,
        email,
        phone,
        address,
        cityAndCountry,
        bio,
    } = req.body;
    if (
        !first ||
        !last ||
        !specialties ||
        !email ||
        !phone ||
        !address ||
        !cityAndCountry ||
        !bio
    ) {
        return res.json({
            error: "You must fill in all the fields.",
        });
    } else {
        next();
    }
}

app.post(
    "/edit-profile-with-pic.json",
    uploader.single("file"),
    hasAllProfileFields,
    s3.upload,
    async (req, res) => {
        let {
            first,
            last,
            specialties,
            email,
            phone,
            address,
            cityAndCountry,
            bio,
        } = req.body;
        let url = `https://s3.amazonaws.com/buckethealthformusic/${req.file.filename}`;

        try {
            const query = await db.updateProfileWithPic(
                req.session.userId,
                first,
                last,
                specialties,
                email,
                phone,
                address,
                cityAndCountry,
                bio,
                url
            );
            const { rows } = query;
            return res.json(rows[0]);
        } catch (err) {
            console.log("error on POST /edit-profile-with-pic.json", err);
            return res.sendStatus(500);
        }
    }
);

app.post(
    "/edit-profile-text-only.json",
    hasAllProfileFields,
    async (req, res) => {
        let {
            first,
            last,
            specialties,
            email,
            phone,
            address,
            cityAndCountry,
            bio,
        } = req.body;

        try {
            const query = await db.updateProfileText(
                req.session.userId,
                first,
                last,
                specialties,
                email,
                phone,
                address,
                cityAndCountry,
                bio
            );
            const { rows } = query;
            return res.json(rows[0]);
        } catch (err) {
            console.log("error on POST /edit-profile-text-only.json", err);
            return res.sendStatus(500);
        }
    }
);

app.get("/doctor-own-articles.json", async (req, res) => {
    try {
        const query = await db.getDoctorArticles(req.session.userId);
        const { rows } = query;
        res.json(rows);
    } catch (err) {
        console.log("error on GET /doctor-own-articles.json", err);
    }
});

app.get("/more-doctor-articles/:smallestId.json", async (req, res) => {
    try {
        const smallestId = parseInt(req.params.smallestId);
        const query = await db.getMoreDoctorArticles(
            req.session.userId,
            smallestId
        );
        const { rows } = query;
        res.json(rows);
    } catch (err) {
        console.log("error on GET /more-doctor-articles/:smallestId.json", err);
    }
});

app.get("/other-user/:otherUserId.json", async (req, res) => {
    try {
        const otherUserId = parseInt(req.params.otherUserId);
        const query = await db.getOtherUser(otherUserId);
        const { rows } = query;
        res.json(rows[0]);
    } catch (err) {
        console.log("error on GET /other-user.json", err);
    }
});

app.get("/all-users.json", async (req, res) => {
    try {
        const query = await db.getAllUsers();
        const { rows } = query;
        res.json(rows);
    } catch (err) {
        console.log("error on GET /all-users.json", err);
    }
});

app.get("/all-doctors.json", async (req, res) => {
    try {
        const { rows } = await db.getAllDoctors();
        res.json(rows);
    } catch (err) {
        console.log("error on GET /all-doctors.json", err);
    }
});

app.get("/more-doctors/:smallestId.json", async (req, res) => {
    try {
        const smallestId = parseInt(req.params.smallestId);
        const { rows } = await db.getMoreDoctors(smallestId);
        res.json(rows);
    } catch (err) {
        console.log("error on GET /more-doctors/:smallestId.json", err);
    }
});

app.get("/logout", (req, res) => {
    delete req.session.userId;
    delete req.session.doctor;
    return res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

const privateChatIds = {};

io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    privateChatIds[socket.id] = userId;

    const { rows: allPrivMsgs } = await db.getPrivateMsgs(userId);
    socket.emit("allPrivMsgs", allPrivMsgs);

    socket.on("newPrivMsg", ({ newPrivMsg, otherUserId }) => {
        db.addNewPrivMsg(newPrivMsg, userId, otherUserId)
            .then(({ rows }) => {
                for (const prop in privateChatIds) {
                    if (privateChatIds[prop] === otherUserId) {
                        io.to(prop).emit("receivedNewPrivMsg", rows[0]);
                    }
                }
                socket.emit("receivedNewPrivMsg", rows[0]);
            })
            .catch((err) => console.log("error oon new private message", err));
    });

    socket.on("disconnect", () => {
        delete privateChatIds[socket.id];
    });
});
