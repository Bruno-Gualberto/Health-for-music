const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../database/db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");

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

app.post("/user/login.json", (req, res) => {
    let hashedPassword = "";
    let userId;
    const { email, password } = req.body;

    db.getUserByEmail(email).then(({ rows }) => {
        hashedPassword = rows[0].password;
        userId = rows[0].id
    }).then(() => {
        compare(password, hashedPassword).then(isMatch => {
            if (!isMatch) {
                return res.json({ success: false });
            } else {
                req.session.userId = userId;
                return res.json({ success: true })
            }
        })
    }).catch(err => {
        console.log("error on getting user info on login", err);
        return res.json({ success: false });
    })
});

app.post("/reset-password/email.json", (req, res) => {
    const message = "Here is your reset code: ";
    const subject = "Reset password code";

    db.getUserByEmail(req.body.email).then(({ rows }) => {
        if (rows.length) {
            const secretCode = cryptoRandomString({ length: 6 });
            db.addResetCode(rows[0].email, secretCode).then(({ rows }) => {
                // send email
                sendEmail(rows[0].email, message + rows[0].code, subject).then(() => {
                    return res.json({ success: true })
                }).catch(err => {
                    console.log("error sending email", err)
                    return res.json({ success: false })
                })
            }).catch(err => {
                console.log("error adding reset code", err)
                return res.json({ success: false })
            })
        } else {
            return res.json({ success: false });
        }
    }).catch(err => {
        console.log("error getting user info on POST /reset-password/email.json", err);
        return res.json({ success: false });
    })
});

app.post("/reset-password/verify.json", (req, res) => {
    const { email, code, password } = req.body;
    db.getCode(email).then(({ rows }) => {
        if (rows.length) {
            if (rows[0].code === code) {
                hash(password).then((hashedPassword) => {
                    db.updatePassword(hashedPassword, email).then(() => {
                        return res.json({ success: true });
                    }).catch((err) => {
                        console.log("error updating password:", err);
                        return res.json({ success: false, error: "Ops, something went wrong!"});
                    });
                }).catch((err) => {
                    console.log("error hashing password", err);
                    return res.json({ success: false, error: "Ops, something went wrong!" });
                });
            } else {
                return res.json({ success: false, error: "Your reset code maybe wrong. Please try again." });
            }
        } else {
            return res.json({ success: false, error: "The reset code is either wrong or to old. Please try again." });
        }
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
