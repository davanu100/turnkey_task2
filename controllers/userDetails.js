const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.getUserDetails = (req, res, next) => {
    const token = req.get("Authorization").split(" ")[1];

    try {
        var tokenData = jwt.verify(token, "This is a secret code");
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ "message": "invalid token" });
    };

    const email = tokenData.email;

    User.findOne({ email: email })
        .then(user => {

            return res.status(200).json({
                "message": "Succesfully Retrieved user data",
                userData: {
                    name: user.name,
                    email: user.email,
                    contact: user.contact
                }
            });
        })
        .catch(err => console.log(err));
};
