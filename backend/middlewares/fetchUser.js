const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
    const token = req.cookies['auth-token'] || req.header('auth-token');
    
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    else {
        try {
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data;
            next();
        } catch (error) {
            res.status(401).send({ error: "Please authenticate using a valid token" });
        }
    }
}

module.exports = fetchUser;