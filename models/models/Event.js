import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema(
    {
        name: String,
        address: String,
        city: String,
        state: String,
        postalCode: String,
    },
    { _id: false }
);

const EventSchema = new mongoose.Schema({
    eventId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: String,
    category: { type: String, index: true },
    startDate: { type: Date, index: true },
    endDate: Date,
    venue: VenueSchema,
    price: { min: Number, max: Number, currency: String },
    url: String,
    image: String,
    source: String,
    createdAt: { type: Date, default: Date.now },
});

EventSchema.index({
    title: "text",
    description: "text",
    category: "text",
    "venue.city": "text",
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
