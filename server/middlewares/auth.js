const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (req, res, next) => {
    let token = req.headers["authorization"] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Strip "Bearer " prefix if present
    if (typeof token === "string" && token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token." });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;
