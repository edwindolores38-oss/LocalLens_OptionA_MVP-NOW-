import { requireAuth } from "../../../lib/auth";

export default async function handler(req, res) {
    const user = await requireAuth(req, res);
    if (!user) return;
    res.json(user);
}
