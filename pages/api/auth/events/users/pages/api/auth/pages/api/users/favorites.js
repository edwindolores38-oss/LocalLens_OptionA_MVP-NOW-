import { requireAuth } from "../../../lib/auth";
import Event from "../../../models/Event";

export default async function handler(req, res) {
    const user = await requireAuth(req, res);
    if (!user) return;

    if (req.method === "GET") {
        const favIds = (user.favorites || []).map((f) => f.eventId);
        const events = await Event.find({ eventId: { $in: favIds } });
        return res.json({ favorites: user.favorites, events });
    }

    if (req.method === "POST") {
        const { eventId } = req.body || {};
        if (!eventId) return res.status(400).json({ error: "eventId required" });
        const exists = (user.favorites || []).find((f) => f.eventId === eventId);
        if (!exists) user.favorites.push({ eventId });
        await user.save();
        return res.json({ message: "Event added to favorites" });
    }

    if (req.method === "DELETE") {
        const { eventId } = req.query || {};
        user.favorites = (user.favorites || []).filter(
            (f) => f.eventId !== eventId
        );
        await user.save();
        return res.json({ message: "Event removed from favorites" });
    }

    res.status(405).end();
}