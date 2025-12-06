import dbConnect from "../../../lib/db";
import Event from "../../../models/Event";

export default async function handler(req, res) {
    await dbConnect();
    const { eventId } = req.query;

    if (req.method === "GET") {
        const ev = await Event.findOne({ eventId });
        if (!ev) return res.status(404).json({ error: "Not found" });
        return res.json(ev);
    }

    if (req.method === "PUT") {
        const update = req.body || {};
        const ev = await Event.findOneAndUpdate(
            { eventId },
            { $set: update },
            { new: true }
        );
        if (!ev) return res.status(404).json({ error: "Not found" });
        return res.json(ev);
    }

    if (req.method === "DELETE") {
        await Event.deleteOne({ eventId });
        return res.json({ ok: true });
    }

    res.status(405).end();
}
