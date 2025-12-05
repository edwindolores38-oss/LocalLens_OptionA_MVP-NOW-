import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
    const { token, logout } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="container py-4 flex items-center gap-4">
                    <Link href="/" className="font-bold text-xl">
                        LocalLens
                    </Link>
                    <nav className="ml-auto flex gap-3 items-center">
                        <Link href="/">Search</Link>
                        {token ? (
                            <>
                                <Link href="/profile">Profile</Link>
                                <button onClick={logout} className="btn bg-gray-200">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">Login</Link>
                                <Link href="/register">Register</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="container py-4">{children}</main>
        </div>
    );
}
