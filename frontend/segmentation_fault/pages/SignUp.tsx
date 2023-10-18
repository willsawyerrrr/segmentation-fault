import { useState } from "react";

import useDocumentTitle from "../utils/useDocumentTitle";

import { signUp } from "../api";

interface SignUpProps {}

export default function SignUp({}: SignUpProps): JSX.Element {
    useDocumentTitle("Sign Up");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== passwordConfirmation) {
            alert("Passwords do not match");
            return;
        }

        const button = document.getElementById("sign-up") as HTMLButtonElement;

        try {
            button.disabled = true;
            await signUp({
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                email: email,
            });
            location.href = "/login";
        } catch {
            button.disabled = false;
        }
    }

    return (
        <form className="flex w-full max-w-lg flex-col gap-6" onSubmit={handleSignup}>
            <h1 className="text-center">Sign Up</h1>
            <label htmlFor="first-name">First Name</label>
            <input
                autoComplete="given-name"
                id="first-name"
                onChange={(e) => setFirstName(e.target.value)}
                required
                type="text"
                value={firstName}
            />

            <label htmlFor="last-name">Last Name</label>
            <input
                autoComplete="family-name"
                id="last-name"
                onChange={(e) => setLastName(e.target.value)}
                required
                type="text"
                value={lastName}
            />

            <label htmlFor="username">Username</label>
            <input
                autoComplete="username"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                required
                type="text"
                value={username}
            />

            <label htmlFor="email">Email</label>
            <input
                autoComplete="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                type="text"
                value={email}
            />

            <label htmlFor="password">Password</label>
            <input
                autoComplete="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
            />

            <label htmlFor="password-confirmation">Confirm Password</label>
            <input
                autoComplete="password"
                id="password-confirmation"
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                type="password"
                value={passwordConfirmation}
            />

            <button className="w-full bg-slate-900 text-white" id="sign-up" type="submit">
                Sign Up
            </button>
        </form>
    );
}
