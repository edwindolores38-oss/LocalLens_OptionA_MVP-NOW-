import bcrypt from "bcrypt";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import { signToken } from "../../../lib/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    await dbConnect();
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = signToken(user);
    res.json({ token });
}
