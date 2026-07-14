const jwt = require('jsonwebtoken');

const { User } = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key';


exports.generateAccessToken = async (user_id, otp_verified = false) => {
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
        throw new Error("User not found");
    }
    const role = user.role;
    return jwt.sign({ userId: user_id, otpVerified: otp_verified, role: role }, JWT_SECRET, { expiresIn: '4h' });
};
exports.generateRefreshToken = (user_id) => {
    return jwt.sign({ userId: user_id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

exports.verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        console.log("Decoded role:", decoded.role); 
        const user = await User.findOne({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
        req.userId = decoded.userId;
        req.userObj = user;
        req.role = decoded.role; // Lưu thông tin role vào request để sử dụng trong các route khác

        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};
exports.decodeToken = (req) => {
    try {
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        console.log("Received token:", token);
        if (!token) return null;

        const cleanToken = token.replace("Bearer ", "");
        const decoded = jwt.verify(cleanToken, JWT_SECRET);
        console.log("Decoded token:", decoded);

        return decoded;
    } catch (err) {
        console.error("JWT Decode Error:", err.message);
        return null;
    }
};
