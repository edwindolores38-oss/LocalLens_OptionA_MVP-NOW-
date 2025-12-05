import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function EventCard({ event }) {
    const start = event.startDate
        ? new Date(event.startDate).toLocaleString()
        : "TBA";
    const { token } = useAuth();

    async function saveFavorite() {
        if (!token) {
            alert("Please login first");
            return;
        }
        const res = await fetch("/api/users/favorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ eventId: event.eventId }),
        });
        if (res.ok) alert("Saved to favorites");
        else alert("Could not save favorite");
    }

    return (
        <div className="card">
            <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                    IMG
                </div>
                <div className="flex-1">
                    <Link
                        href={`/events/${event.eventId}`}
                        className="text-lg font-semibold hover:underline"
                    >
                        {event.title}
                    </Link>
                    <p className="text-sm text-gray-600">
                        {event.venue?.name} · {event.venue?.city}
                    </p>
                    <p className="text-sm mt-1">{start}</p>
                </div>
            </div>
            <div className="mt-3 flex gap-2">
                {event.url && (
                    <a
                        href={event.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-sm"
                    >
                        View
                    </a>
                )}
                <button onClick={saveFavorite} className="btn btn-primary text-sm">
                    Save
                </button>
            </div>
        </div>
    );
}
