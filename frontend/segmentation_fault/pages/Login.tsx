import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import CurrentUserContext from "../contexts/CurrentUserContext";

import useDocumentTitle from "../utils/useDocumentTitle";

import { getCurrentUser, login } from "../api";

interface LoginProps {}

export default function Login({}: LoginProps): JSX.Element {
    useDocumentTitle("Login");

    const { setCurrentUser } = useContext(CurrentUserContext);

    const [username, setUsername] = useState(window.localStorage.getItem("username") ?? "");
    const [password, setPassword] = useState(window.localStorage.getItem("password") ?? "");
    const [remember, setRemember] = useState(window.localStorage.getItem("remember") === "true");

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const button = document.getElementById("login") as HTMLButtonElement;

        if (remember) {
            window.localStorage.setItem("username", username);
            window.localStorage.setItem("password", password);
            window.localStorage.setItem("remember", remember.toString());
        } else {
            window.localStorage.removeItem("username");
            window.localStorage.removeItem("password");
            window.localStorage.removeItem("remember");
        }

        try {
            button.disabled = true;
            const token = await login({ username, password });
            window.sessionStorage.setItem("token", token.accessToken);
            setCurrentUser(await getCurrentUser());
            location.href = "/home";
        } catch {
            button.disabled = false;
        }
    }

    return (
        <form className="flex w-full max-w-lg flex-col gap-6" onSubmit={handleLogin}>
            <h1 className="text-center">Sign Into Your Account</h1>
            <label htmlFor="username">Username</label>
            <input
                autoComplete="username"
                id="username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                required
                type="text"
                value={username}
            />
            <label htmlFor="password">Password</label>
            <input
                autoComplete="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
            />
            <div className="flex flex-col justify-between gap-2">
                <div className="flex flex-row justify-between px-1">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <input
                            checked={remember}
                            className="h-3.5 w-3.5"
                            id="remember-me"
                            name="remember-me"
                            onChange={(e) => setRemember(e.target.checked)}
                            type="checkbox"
                        />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <Link className="text-base" to="/forgot-password">
                        Forgot Password?
                    </Link>
                </div>
                <button className="w-full bg-slate-900 text-white" id="login" type="submit">
                    Log In
                </button>
                <Link className="text-center text-sm" to="/sign-up">
                    Sign Up
                </Link>
            </div>
        </form>
    );
}
