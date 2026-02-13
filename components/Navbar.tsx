"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 ${isScrolled ? "glass-morphism py-3" : "py-4"
                }`}
            id="navbar"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-accent rounded-twelve flex items-center justify-center">
                        <span className="text-brand-bg font-bold text-xl">A</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">Automytee</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#home" className="nav-link hover:text-brand-accent transition-colors">Home</Link>
                    <Link href="#about" className="nav-link hover:text-brand-accent transition-colors">About</Link>
                    <Link href="#solutions" className="nav-link hover:text-brand-accent transition-colors">Solutions</Link>
                    <Link href="#projects" className="nav-link hover:text-brand-accent transition-colors">Projects</Link>
                    <Link href="#contact" className="nav-link hover:text-brand-accent transition-colors">Contact</Link>
                </div>

                <button className="hidden md:block px-6 py-2 border border-brand-accent text-brand-accent rounded-twelve hover:bg-brand-accent hover:text-brand-bg transition-all duration-300 text-sm font-semibold">
                    Get Started
                </button>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-brand-accent"
                    id="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-0 z-[60] bg-brand-bg/95 backdrop-blur-lg transition-transform duration-500 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full p-8">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-brand-accent rounded-twelve flex items-center justify-center">
                                <span className="text-brand-bg font-bold text-xl">A</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Automytee</span>
                        </div>
                        <button
                            className="text-brand-accent"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col gap-8 text-2xl font-bold">
                        <Link href="#home" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-accent transition-colors">Home</Link>
                        <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-accent transition-colors">About</Link>
                        <Link href="#solutions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-accent transition-colors">Solutions</Link>
                        <Link href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-accent transition-colors">Projects</Link>
                        <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-accent transition-colors">Contact</Link>
                    </div>
                    <button className="mt-auto px-6 py-4 bg-brand-accent text-brand-bg rounded-twelve font-bold uppercase tracking-widest text-sm">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
