import { useState } from "react";
import Layout from "../context/Layout";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setToken } = useAuth();
    const router = useRouter();

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            setToken(data.token);
            router.push("/");
        } else {
            setError(data.error || "Registration failed");
        }
    }

    return (
        <Layout>
            <form onSubmit={onSubmit} className="card max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-3">Register</h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <input
                    className="input mb-2"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="input mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="input mb-2"
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-primary">Create Account</button>
            </form>
        </Layout>
    );
}
