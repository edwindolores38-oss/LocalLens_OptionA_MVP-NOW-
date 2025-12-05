import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../context/Layout";


export default function EventDetail() {
    const router = useRouter();
    const { eventId } = router.query;
    const [ev, setEv] = useState(null);

    useEffect(() => {
        if (!eventId) return;
        (async () => {
            const res = await fetch(`/api/events/${eventId}`);
            const data = await res.json();
            setEv(data);
        })();
    }, [eventId]);

    if (!ev) {
        return (
            <Layout>
                <p>Loading...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="card">
                <h2 className="text-xl font-bold">{ev.title}</h2>
                <p className="text-sm text-gray-600">
                    {ev.venue?.name} · {ev.venue?.city}
                </p>
                <p className="mt-2">
                    {ev.startDate ? new Date(ev.startDate).toLocaleString() : "TBA"}
                </p>
                <p className="mt-2">{ev.description}</p>
                {ev.url && (
                    <a
                        href={ev.url}
                        className="underline mt-3 inline-block"
                        target="_blank"
                        rel="noreferrer"
                    >
                        View source
                    </a>
                )}
            </div>
        </Layout>
    );
}
