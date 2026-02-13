"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-white p-6 text-center">
            <h2 className="text-6xl font-bold text-brand-accent mb-4">404</h2>
            <h3 className="text-2xl font-bold mb-4">System Not Found</h3>
            <p className="text-slate-400 mb-8 max-w-md">
                The system logic you are looking for does not exist in our current architecture.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-brand-accent text-brand-bg font-bold rounded-twelve hover:scale-105 transition-all uppercase tracking-widest text-sm"
            >
                Return to Core
            </Link>
        </div>
    );
}
