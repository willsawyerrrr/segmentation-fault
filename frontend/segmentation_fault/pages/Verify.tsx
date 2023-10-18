import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useDocumentTitle from "../utils/useDocumentTitle";

import { verifyEmail } from "../api";

export default function Verify(): JSX.Element {
    useDocumentTitle("Verify Email");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await verifyEmail(new URLSearchParams(window.location.search).get("token") as string);
            setLoading(false);
        })();
    }, []);

    return loading ? (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <div className="flex h-1/2 w-1/2 flex-col items-center justify-center">
                <h1 className="text-center text-4xl font-bold text-gray-800">Verifying...</h1>
            </div>
        </div>
    ) : (
        <>
            <div className="flex h-screen w-full flex-col items-center justify-center">
                <div className="flex h-1/2 w-1/2 flex-col items-center justify-center">
                    <h1 className="text-center text-4xl font-bold text-gray-800">
                        Your email has been verified!
                    </h1>
                    <Link to="/login">Click here to login</Link>
                </div>
            </div>
        </>
    );
}
