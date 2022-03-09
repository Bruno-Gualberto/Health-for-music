const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../database/db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");

app.use(compression());

app.use(cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true
    })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/user/register.json", (req, res) => {
    console.log("POST request on /user/register.json", req.body);
    const { first, last, email, password } = req.body;
    if (first || last || email || password) {
        hash(password).then(hashedPassword => {
            db.addUser(first, last, email, hashedPassword).then(({ rows }) => {
                console.log("logging user id after POST on /user/register.json: ", rows[0].id);
                req.session.userId = rows[0].id;
                return res.json({ success: true });
            }).catch(err => {
                console.log("error adding user info:", err);
                return res.json({ success: false });
            })
        }).catch(err => {
            console.log("error hashing password: ", err);
            return res.json({ success: false });
        })
    } else {
        return res.json({ success: false });
    }
});

app.get("/user/id.json", (req, res) => {
    res.json({ userId: req.session.userId });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
