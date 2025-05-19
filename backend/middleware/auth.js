import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            if (decoded.role === "user") {
                req.userId = decoded.userId;
            } else if (decoded.role === "station") {
                req.stationId = decoded.stationId;
            } else {
                return res.status(403).json({ message: "Invalid token role" });
            }

            req.role = decoded.role;
            next();
        });
    } else {
        res.sendStatus(401).json({ message : "Unauthorized User"});
    }
};
