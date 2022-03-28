const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../database/db");
const cookieSession = require("cookie-session");
// const { hash, compare } = require("./bc");
// const cryptoRandomString = require("crypto-random-string");

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const cookieSessionMiddleware = cookieSession({
    secret: process.env.SECRET || `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

// const multer = require("multer");
// const uidSafe = require("uid-safe");

// const s3 = require("./s3");

// const diskStorage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, path.join(__dirname, "uploads"));
//     },
//     filename: function (req, file, callback) {
//         uidSafe(24).then((uid) => {
//             callback(null, uid + path.extname(file.originalname));
//         });
//     },
// });

// const uploader = multer({
//     storage: diskStorage,
//     limits: {
//         fileSize: 2097152,
//     },
// });

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
    const query = await db.addDoctor();
    const { rows } = await query;
    req.session.userId = rows[0].id;
    req.session.doctor = rows[0].doctor;
    res.json(rows[0]);
});

app.post("/add-user.json", async (req, res) => {
    const query = await db.addUser();
    const { rows } = await query;
    req.session.userId = rows[0].id;
    req.session.doctor = rows[0].doctor;
    res.json(rows[0]);
});

// app.get("/logout", (req, res) => {
//     delete req.session.userId;
//     return res.redirect("/");
// });

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// const privateChatIds = {};

// io.on("connection", async (socket) => {
//     if (!socket.request.session.userId) {
//         return socket.disconnect(true);
//     }

//     const userId = socket.request.session.userId;

//     privateChatIds[socket.id] = userId;
//     console.log("privateChatIds", privateChatIds);

//     const { rows: allPrivMsgs } = await db.getPrivateMsgs(userId);
//     socket.emit("allPrivMsgs", allPrivMsgs);

//     socket.on("newPrivMsg", ({ newPrivMsg, friendId }) => {
//         db.addNewPrivMsg(newPrivMsg, userId, friendId)
//             .then(({ rows }) => {
//                 for (const prop in privateChatIds) {
//                     if (privateChatIds[prop] === friendId) {
//                         io.to(prop).emit("receivedNewPrivMsg", rows[0]);
//                     }
//                 }
//                 socket.emit("receivedNewPrivMsg", rows[0]);
//             })
//             .catch((err) => console.log("error oon new private message", err));
//     });

//     socket.on("disconnect", () => {
//         delete privateChatIds[socket.id];
//         console.log(privateChatIds);
//     });
// });
