import { useEffect, useState } from "react";
import Layout from "../context/Layout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { token } = useAuth();
    const [me, setMe] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!token) return;
        (async () => {
            const meRes = await fetch("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const meData = await meRes.json();
            setMe(meData);
            const favRes = await fetch("/api/users/favorites", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const favData = await favRes.json();
            setFavorites(favData.events || []);
        })();
    }, [token]);

    if (!token) {
        return (
            <Layout>
                <p>Please login to view your profile.</p>
            </Layout>
        );
    }

    if (!me) {
        return (
            <Layout>
                <p>Loading...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <h2 className="text-xl font-bold mb-2">Hello, {me.name}</h2>
            <h3 className="text-lg font-semibold mb-2">Your Favorites</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {favorites.map((ev) => (
                    <li key={ev.eventId} className="card">
                        <div className="font-semibold">{ev.title}</div>
                        <div className="text-sm text-gray-600">
                            {ev.venue?.name} · {ev.venue?.city}
                        </div>
                    </li>
                ))}
            </ul>
        </Layout>
    );
}
