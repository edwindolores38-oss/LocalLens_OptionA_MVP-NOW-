import dbConnect from "../../../lib/db";
import Event from "../../../models/Event";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        const { q, category, city, start, end, page = 1, limit = 12 } = req.query;
        const filter = {};
        if (q) filter.$text = { $search: q };
        if (category) filter.category = category;
        if (city) filter["venue.city"] = new RegExp(`^${city}$`, "i");
        if (start || end) {
            filter.startDate = {};
            if (start) filter.startDate.$gte = new Date(start);
            if (end) filter.startDate.$lte = new Date(end);
        }
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const events = await Event.find(filter)
            .sort({ startDate: 1 })
            .skip(skip)
            .limit(parseInt(limit, 10));
        return res.json(events);
    }

    if (req.method === "POST") {
        const body = req.body || {};
        if (!body.eventId || !body.title) {
            return res.status(400).json({ error: "eventId and title required" });
        }
        const created = await Event.findOneAndUpdate(
            { eventId: body.eventId },
            { $set: body },
            { upsert: true, new: true }
        );
        return res.status(201).json(created);
    }

    res.status(405).end();
}
