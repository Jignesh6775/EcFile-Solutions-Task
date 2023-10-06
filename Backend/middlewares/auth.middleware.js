const jwt = require('jsonwebtoken');
require('dotenv').config()


const auth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (decoded) {
            // console.log(decoded)
            req.body.userID = decoded.userID
            next()
        } else {
            res.status(400).send({ msg: "Token is not valid" })
        }
    } else {
        res.status(400).send({ msg: "Please Login First" })
    }
}


module.exports = {
    auth
}