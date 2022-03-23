const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../database/db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");

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

app.post("/user/register.json", (req, res) => {
    console.log("POST request on /user/register.json", req.body);
    const { first, last, email, password } = req.body;
    if (first || last || email || password) {
        hash(password)
            .then((hashedPassword) => {
                db.addUser(first, last, email, hashedPassword)
                    .then(({ rows }) => {
                        console.log(
                            "logging user id after POST on /user/register.json: ",
                            rows[0].id
                        );
                        req.session.userId = rows[0].id;
                        return res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("error adding user info:", err);
                        return res.json({
                            success: false,
                            error:
                                "Ops! Something went wrong. Please try again.",
                        });
                    });
            })
            .catch((err) => {
                console.log("error hashing password: ", err);
                return res.json({
                    success: false,
                    error: "Ops! Something went wrong! Please try again.",
                });
            });
    } else {
        return res.json({
            success: false,
            error: "All fields with * are required",
        });
    }
});

app.get("/user/id.json", (req, res) => {
    res.json({ userId: req.session.userId });
});

app.post("/user/login.json", (req, res) => {
    let hashedPassword = "";
    let userId;
    const { email, password } = req.body;

    db.getUserByEmail(email)
        .then(({ rows }) => {
            hashedPassword = rows[0].password;
            userId = rows[0].id;
        })
        .then(() => {
            compare(password, hashedPassword).then((isMatch) => {
                if (!isMatch) {
                    return res.json({
                        success: false,
                        error: "Ops! Wrong password or email.",
                    });
                } else {
                    req.session.userId = userId;
                    return res.json({ success: true });
                }
            });
        })
        .catch((err) => {
            console.log("error on getting user info on login", err);
            return res.json({
                success: false,
                error: "Ops! Wrong password or email.",
            });
        });
});

app.post("/reset-password/email.json", (req, res) => {
    const message = "Here is your reset code: ";
    const subject = "Reset password code";

    db.getUserByEmail(req.body.email)
        .then(({ rows }) => {
            if (rows.length) {
                const secretCode = cryptoRandomString({ length: 6 });
                db.addResetCode(rows[0].email, secretCode)
                    .then(({ rows }) => {
                        // send email
                        sendEmail(
                            rows[0].email,
                            message + rows[0].code,
                            subject
                        )
                            .then(() => {
                                return res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("error sending email", err);
                                return res.json({ success: false });
                            });
                    })
                    .catch((err) => {
                        console.log("error adding reset code", err);
                        return res.json({ success: false });
                    });
            } else {
                return res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log(
                "error getting user info on POST /reset-password/email.json",
                err
            );
            return res.json({ success: false });
        });
});

app.post("/reset-password/verify.json", (req, res) => {
    const { email, code, password } = req.body;
    db.getCode(email)
        .then(({ rows }) => {
            if (rows.length) {
                if (rows[0].code === code) {
                    hash(password)
                        .then((hashedPassword) => {
                            db.updatePassword(hashedPassword, email)
                                .then(() => {
                                    return res.json({ success: true });
                                })
                                .catch((err) => {
                                    console.log(
                                        "error updating password:",
                                        err
                                    );
                                    return res.json({
                                        success: false,
                                        error: "Ops, something went wrong!",
                                    });
                                });
                        })
                        .catch((err) => {
                            console.log("error hashing password", err);
                            return res.json({
                                success: false,
                                error: "Ops, something went wrong!",
                            });
                        });
                } else {
                    return res.json({
                        success: false,
                        error: "Your reset code maybe wrong. Please try again.",
                    });
                }
            } else {
                return res.json({
                    success: false,
                    error:
                        "The reset code is either wrong or to old. Please try again.",
                });
            }
        })
        .catch((err) => {
            console.log("error getting code by email: ", err);
            return res.json({
                success: false,
                error:
                    "The reset code is either wrong or to old. Please try again.",
            });
        });
});

app.get("/user/data.json", (req, res) => {
    db.getUserById(req.session.userId)
        .then(({ rows }) => {
            return res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error on GET /user/data.json", err);
            return res.json({ success: false });
        });
});

app.post(
    "/profile-pic.json",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        let url = `https://s3.amazonaws.com/bucketsocialnetwork/${req.file.filename}`;

        db.updateImage(req.session.userId, url)
            .then(({ rows }) => {
                res.json({ profilePic: rows[0].profilePic });
            })
            .catch((err) =>
                console.log("error on POST /profile-pic.json", err)
            );
    }
);

app.post("/user/add-update-bio.json", (req, res) => {
    db.addUpdateBio(req.body.bio, req.session.userId)
        .then(({ rows }) => {
            res.json({ bio: rows[0].bio });
        })
        .catch((err) => console.log("error adding bio", err));
});

app.get("/last-users.json", async (req, res) => {
    try {
        const lastUsers = await db.getLastUsers().then(({ rows }) => rows);
        return res.json({ users: lastUsers, error: false });
    } catch (err) {
        console.log("error on getting last users: ", err);
        return res.json({ error: true });
    }
});

app.get("/searched-users", async (req, res) => {
    try {
        const searchedUsers = await db
            .getSearchedUsers(req.query.search)
            .then(({ rows }) => rows);
        return res.json({ users: searchedUsers, error: false });
    } catch (err) {
        console.log("error on getting last users: ", err);
        return res.json({ error: true });
    }
});

app.get("/other-user/:otherUserId.json", async (req, res) => {
    try {
        const otherUserInfo = await db
            .getOtherUser(req.params.otherUserId)
            .then(({ rows }) => rows[0]);
        if (!otherUserInfo) {
            return res.json({ error: true });
        }
        return res.json({
            ...otherUserInfo,
            loggedUserId: req.session.userId,
            error: false,
        });
    } catch (err) {
        console.log("error on getting other user info: ", err);
        return res.json({ error: true });
    }
});

app.get("/friendship/:otherUserId", async (req, res) => {
    try {
        const friendship = await db
            .getFriendship(req.session.userId, req.params.otherUserId)
            .then(({ rows }) => rows[0]);
        if (!friendship) {
            return res.json({ hasFriendship: false });
        } else {
            return res.json({
                ...friendship,
                hasFriendship: true,
                loggedUserId: req.session.userId,
            });
        }
    } catch (err) {
        console.log("error getting friendships", err);
        return res.json({ error: true });
    }
});

app.post("/friendship-status.json", async (req, res) => {
    const otherUserId = parseInt(req.body.otherUserId);

    if (req.body.action === "SEND-REQUEST") {
        db.sendRequest(req.session.userId, otherUserId)
            .then(() => {
                return res.json({ error: false });
            })
            .catch((err) => {
                console.log("error on friendship requests: ", err);
                return res.json({ error: true });
            });
    } else if (req.body.action === "ACCEPT-REQUEST") {
        db.acceptRequest(req.session.userId, otherUserId)
            .then(() => {
                return res.json({ error: false });
            })
            .catch((err) => {
                console.log("error on friendship requests: ", err);
                return res.json({ error: true });
            });
    } else if (req.body.action === "DELETE-REQUEST") {
        db.deleteRequest(req.session.userId, otherUserId)
            .then(() => {
                return res.json({ error: false });
            })
            .catch((err) => {
                console.log("error on friendship requests: ", err);
                return res.json({ error: true });
            });
    }
});

app.get("/friends.json", async (req, res) => {
    try {
        const allFriendRequests = await db
            .getAllFriendRequests(req.session.userId)
            .then(({ rows }) => rows);
        res.json(allFriendRequests);
    } catch (err) {
        console.log("error getting all friend requests", err);
        return res.json({ error: true });
    }
});

app.get("/logout", (req, res) => {
    delete req.session.userId;
    return res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    const { rows } = await db.getLatestMessages();
    socket.emit("latestMessages", rows);

    socket.on("wroteNewMessage", (msg) => {
        let messageId;
        let timestamp;
        db.insertMessage(userId, msg)
            .then(({ rows }) => {
                messageId = rows[0].messageId;
                timestamp = rows[0].timestamp;
                return db.getMessageSenderById(userId);
            })
            .then(({ rows }) => {
                io.emit("receiveNewMessage", {
                    first: rows[0].first,
                    last: rows[0].last,
                    profilePic: rows[0].profilePic,
                    messageId,
                    timestamp,
                    senderId: userId,
                    text: msg,
                });
            })
            .catch((err) => console.log("error on new message", err));
    });
});
