import { useState } from "react";

import useDocumentTitle from "../utils/useDocumentTitle";

import { resetPassword } from "../api";

interface ResetPasswordProps {}

export default function ResetPassword({}: ResetPasswordProps): JSX.Element {
    useDocumentTitle("Reset Password");

    const token = new URLSearchParams(location.search).get("token") ?? "";
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const button = document.getElementById("sign-up") as HTMLButtonElement;

        if (password !== passwordConfirmation) {
            alert("Passwords do not match");
            return;
        }

        try {
            button.disabled = true;
            await resetPassword({ token, password });
            location.href = "/login";
        } catch {
            button.disabled = false;
        }
    }

    return (
        <form className="flex w-full max-w-lg flex-col gap-6" onSubmit={handleSubmit}>
            <h1 className="text-center">Reset Password</h1>

            <label htmlFor="email">Password</label>
            <input
                autoComplete="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="new-password"
                value={password}
            />

            <label htmlFor="email">Confirm Password</label>
            <input
                autoComplete="password-confirm"
                id="password-confirm"
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                type="new-password"
                value={passwordConfirmation}
            />

            <button className="w-full bg-slate-900 text-white" id="sign-up" type="submit">
                Request Password Reset
            </button>
        </form>
    );
}
