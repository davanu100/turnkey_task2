const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(inputtxt) {
    const phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return (inputtxt.match(phoneno));
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ "message": "No such user!" });
            }
            bcrypt
                .compare(password, user.password)
                .then(match => {
                    if (match) {
                        const token = jwt.sign({
                            "email": user.email
                        }, "This is a secret code", { expiresIn: "1h" });
                        return res.status(200).json({
                            "message": "Logged In Successfully",
                            "token": token
                        });
                    }
                    res.status(401).json({ "message": "Invalid Authentication" });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => console.log(err));
};

exports.postSignUp = (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.cPassword;
    const contact = req.body.contact;

    if (name === "") {
        return res.status(406).json({ "message": "Enter a valid name!" });
    }

    if (!validateEmail(email)) {
        return res.status(406).json({ "message": "Email not valid!" });
    }

    if (!validatePhoneNumber(contact)) {
        return res.status(406).json({ "message": "Contact Number not valid!" });
    }

    if (password !== confirmPassword) {
        console.log("Passwords not matching!!");
        return res.status(406).json({ "message": "Passwords don't match!" });
    }

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log('--> User with same email exists');
                return res.status(406).json({ "message": "User with same email exists!" });
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        contact: contact
                    });
                    return user.save()
                })
                .then(result => {
                    console.log('---> new user created');
                    res.status(201).json({ "message": "SignUp Successful!" });
                });
        })
        .catch(err => {
            console.log(err);
        });
};
