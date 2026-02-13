"use client";

import Link from "next/link";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden py-32" id="home">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/20 blur-[80px] rounded-full animate-glow-pulse transform-gpu will-change-transform"></div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-[0.2em] uppercase">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                        Next-Gen Engineering
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter">
                        Architecting <br /> <span className="text-brand-accent">Autonomous</span><br /> Intelligence
                    </h1>
                    <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-light">
                        High-integrity automation systems for global infrastructure. We bridge the physical and digital with precision engineering.
                    </p>
                    <div className="flex flex-wrap gap-6 pt-4">
                        <Link href="#projects" className="px-10 py-5 bg-brand-accent text-brand-bg font-bold rounded-twelve accent-glow hover:scale-105 transition-all uppercase tracking-wider text-sm">
                            View Systems
                        </Link>
                        <Link href="#contact" className="px-10 py-5 glass-morphism font-bold rounded-twelve hover:bg-white/10 transition-all border border-white/10 uppercase tracking-wider text-sm">
                            Consultancy
                        </Link>
                    </div>
                </div>

                {/* 3D Abstract Representation */}
                <div className="relative flex justify-center items-center">
                    <div className="relative w-full aspect-square flex items-center justify-center">
                        {/* Floating Gradients */}
                        <div className="absolute w-[150%] h-[150%] bg-brand-accent/5 blur-[80px] rounded-full animate-glow-pulse transform-gpu will-change-transform"></div>
                        <div className="relative w-96 h-96">
                            {/* Core Ring 1 */}
                            <div className="absolute inset-0 border-[0.5px] border-brand-accent/30 rounded-full animate-spin-slow"></div>
                            {/* Core Ring 2 */}
                            <div className="absolute inset-10 border-[1px] border-brand-accent/10 rounded-full animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>

                            {/* Central Mechanical Core */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-64 h-64 flex items-center justify-center">
                                    <div className="absolute w-full h-full border-t border-b border-brand-accent/40 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
                                    <div className="absolute w-4/5 h-4/5 border-l border-r border-brand-accent/20 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                                    <div className="w-32 h-32 glass-morphism rounded-3xl rotate-45 flex items-center justify-center border border-brand-accent shadow-[0_0_80px_rgba(0,240,255,0.3)]">
                                        <svg className="w-16 h-16 text-brand-accent -rotate-45" fill="none" stroke="currentColor" strokeWidth="0.5" viewBox="0 0 24 24">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {/* Orbiting Nodes */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-accent rounded-full accent-glow"></div>
                            <div className="absolute bottom-1/4 right-0 w-2 h-2 bg-brand-accent rounded-full accent-glow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
