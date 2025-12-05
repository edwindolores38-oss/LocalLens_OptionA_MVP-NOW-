import { createContext, useContext, useEffect, useState } from "react";

const KEY = "locallens_token";

// ✅ Give the context a NON-null default value
const AuthContext = createContext({
    token: "",
    setToken: () => { },
    logout: () => { },
});

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(KEY);
        if (stored) setTokenState(stored);
    }, []);

    function setToken(t) {
        setTokenState(t);
        if (typeof window === "undefined") return;
        if (t) window.localStorage.setItem(KEY, t);
        else window.localStorage.removeItem(KEY);
    }

    function logout() {
        setToken("");
    }

    const value = { token, setToken, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    // ✅ Fallback so it's never null, even if provider somehow isn't wrapping
    if (!ctx) {
        return { token: "", setToken: () => { }, logout: () => { } };
    }
    return ctx;
}
