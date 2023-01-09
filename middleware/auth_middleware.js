const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    const acces_token = token.split(" ")[1];
    jwt.verify(acces_token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
    })
    next();
}