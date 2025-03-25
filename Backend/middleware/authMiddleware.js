const user = require('../models/user');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let token = req.headers.authorization.split(" ")[1]; 
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.user.id).select("role");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        return next();       
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.log("Token expired, attempting refresh...");

            const refreshToken = req.headers["x-refresh-token"];
            if (!refreshToken) {
                return res.status(401).json({ message: "Unauthorized: Refresh token missing" });
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const user = await userModel.findById(decodedRefresh.user.id).select("role");

                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }

                // Generate new tokens
                const newAccessToken = jwt.sign(
                    { user: { id: user._id, role: user.role } },
                    process.env.JWT_SECRET,
                    { expiresIn: "15m" }
                );

                const newRefreshToken = jwt.sign(
                    { user: { id: user._id } },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: "7d" }
                );

                res.setHeader("x-access-token", newAccessToken);
                res.setHeader("x-refresh-token", newRefreshToken);

                req.user = user;
                return next();
            } catch (refreshError) {
                return res.status(401).json({ message: "Unauthorized: Invalid refresh token" });
            }
        }

        console.error("JWT Error:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports.roleUser = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You don't have access to this route" });
        }

        next(); 
    };
};
