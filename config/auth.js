import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({
    path: '../config/.env'
});

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode.id;
        next();
    } catch (error) {     
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(500).json({ message: "Server Error" });
    }
}

export default isAuthenticated;