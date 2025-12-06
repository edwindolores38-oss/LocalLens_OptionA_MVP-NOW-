import jwt from "jsonwebtoken";
import User from "../models/user";
import dbConnect from "./db";

export function signToken(user) {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

export async function requireAuth(req, res) {
    await dbConnect();
    const header = req.headers.authorization;
    if (!header) {
        res.status(401).json({ error: "No token provided" });
        return null;
    }
    const token = header.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-passwordHash");
        if (!user) {
            res.status(401).json({ error: "Invalid token user" });
            return null;
        }
        return user;
    } catch (e) {
        res.status(401).json({ error: "Invalid token" });
        return null;
    }
}
