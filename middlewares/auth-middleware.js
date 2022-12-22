const jwt = require("jsonwebtoken");

const db = require("../models")
const Users = db.Users

// Authorization middleware
module.exports = (req, res, next) => {
    const token = req.cookies.accessToken;

    // If the token type is not Bearer or if the token does not exist
    if (!token) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
    }

    try {
        // If the token is not valid, it will cause an error
        // and the catch function will run
        const { userId } = jwt.verify(token, "secretKey");
        
        // .then makes this function a Promise
        Users.findByPk(userId).then((user) => {
            // LOOK THIS UP
            res.locals.user = user;
            // Middleware must have next(), or an error will occur
            next();
        });
    } catch (err) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
    }
};