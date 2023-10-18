import { useState } from "react";

import useDocumentTitle from "../utils/useDocumentTitle";

import { forgotPassword } from "../api";

interface ForgotPasswordProps {}

export default function ForgotPassword({}: ForgotPasswordProps): JSX.Element {
    useDocumentTitle("Forgot Password");

    const [email, setEmail] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const button = document.getElementById("sign-up") as HTMLButtonElement;

        try {
            button.disabled = true;
            await forgotPassword({ email });
            location.href = "/login";
        } catch {
            button.disabled = false;
        }
    }

    return (
        <form className="flex w-full max-w-lg flex-col gap-6" onSubmit={handleSubmit}>
            <h1 className="text-center">Forgot Password</h1>
            <label htmlFor="email">Email</label>
            <input
                autoComplete="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                type="text"
                value={email}
            />
            <button className="w-full bg-slate-900 text-white" id="sign-up" type="submit">
                Request Password Reset
            </button>
        </form>
    );
}
