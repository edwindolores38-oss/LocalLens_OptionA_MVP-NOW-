import bcrypt from "bcrypt";
import dbConnect from "../../../lib/db";
import User from "../../../models/user";
import { signToken } from "../../../lib/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    await dbConnect();
    const { name, email, password } = req.body || {};
    if (!name || !email || !password || password.length < 6) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = signToken(user);
    res.json({ token });
}
