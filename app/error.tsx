"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-white p-6 text-center">
            <h2 className="text-4xl font-bold text-brand-accent mb-4">Something went wrong!</h2>
            <p className="text-slate-400 mb-8 max-w-md">
                We encountered an error while rendering this page. Our engineers are already on it.
            </p>
            <button
                onClick={() => reset()}
                className="px-8 py-3 bg-brand-accent text-brand-bg font-bold rounded-twelve hover:scale-105 transition-all"
            >
                Try again
            </button>
        </div>
    );
}
