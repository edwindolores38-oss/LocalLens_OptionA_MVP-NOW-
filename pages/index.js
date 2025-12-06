import { useEffect, useState } from "react";
import Layout from "../context/Layout";
import EventCard from "../components/components/components/EventCard";
import FiltersBar from "./FiltersBar";

export default function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});

    async function fetchEvents(extra = {}) {
        setLoading(true);
        const params = { limit: 12, page, ...filters, ...extra };
        const url = new URL("/api/events", window.location.origin);
        Object.entries(params).forEach(([k, v]) => {
            if (v !== "" && v != null) url.searchParams.set(k, v);
        });
        const res = await fetch(url);
        const data = await res.json();
        setEvents(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <Layout>
            <h1 className="text-2xl font-semibold mb-3">Discover Local Events</h1>
            <FiltersBar
                onApply={(f) => {
                    setPage(1);
                    setFilters(f);
                    fetchEvents(f);
                }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    events.map((e) => <EventCard key={e.eventId} event={e} />)
                )}
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="btn bg-gray-200"
                >
                    Prev
                </button>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="btn bg-gray-200"
                >
                    Next
                </button>
            </div>
        </Layout>
    );
}
