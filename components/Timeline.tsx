"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        title: "Requirement Analysis",
        desc: "Defining system scope, hardware specifications, and expected throughput.",
        mobileDesc: "Defining system scope and hardware specs.",
        side: "left",
    },
    {
        title: "Architecture Design",
        desc: "Modeling digital twins and planning network topology for redundancy.",
        mobileDesc: "Modeling digital twins and planning.",
        side: "right",
    },
    {
        title: "System Development",
        desc: "Coding AI models, hardware firmware, and dashboard UI.",
        mobileDesc: "System Development",
        side: "left",
    },
    {
        title: "Deployment",
        desc: "On-site installation and rigorous stress testing.",
        mobileDesc: "Deployment",
        side: "right",
    }
];

const TimelineStep = ({ step, index }: { step: typeof steps[0], index: number }) => {
    const isLeft = step.side === "left";

    return (
        <div className={`relative flex flex-col md:flex-row items-start md:items-center mb-12 md:mb-24 md:justify-between group ${!isLeft ? 'md:flex-row-reverse' : ''}`}>

            {/* Desktop Content Side */}
            <motion.div
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`hidden md:block w-5/12 ${isLeft ? 'text-right' : 'text-left'}`}
            >
                <div className="glass-morphism p-8 rounded-twelve border border-white/5 hover:border-brand-accent/30 transition-all duration-500">
                    <span className="text-brand-accent text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Phase 0{index + 1}</span>
                    <h4 className="text-2xl font-bold text-white mb-3">{step.title}</h4>
                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
            </motion.div>

            {/* Center Circle / Mobile Indicator */}
            <div className="absolute left-8 top-0 md:static md:top-auto md:left-auto z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-bg border-4 border-brand-accent flex items-center justify-center -translate-x-1/2 md:translate-x-0 mt-[1.5rem] md:mt-0 shadow-[0_0_15px_rgba(0,242,255,0.5)]">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
                    className="absolute inset-0 bg-brand-accent/20 blur-lg rounded-full animate-pulse"
                />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-brand-accent rounded-full shadow-[0_0_15px_rgba(0,242,255,1)]" />
            </div>

            {/* Mobile Content Side */}
            <motion.div
                initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`w-full md:w-5/12 pl-20 md:pl-0 ${isLeft ? 'md:text-left' : 'md:text-right'}`}
            >
                {/* Mobile Card */}
                <div className="md:hidden glass-morphism p-6 rounded-twelve border border-white/5 relative overflow-hidden group-hover:border-brand-accent/30 transition-all">
                    <span className="text-brand-accent text-[10px] font-bold tracking-widest uppercase mb-2 block">Phase 0{index + 1}</span>
                    <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.mobileDesc}</p>

                    {/* Glowing Accent on Left of Mobile Card */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent/50 shadow-[0_0_10px_rgba(0,242,255,0.3)]" />
                </div>

                {/* Desktop Progress Bar (Hidden on Mobile) */}
                <div className="hidden md:block w-full h-1 bg-white/5 rounded overflow-hidden mt-6">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className="h-full bg-brand-accent shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                    />
                </div>
            </motion.div>
        </div>
    );
};

const Timeline = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section className="py-24 px-6 bg-[#0E1421] relative overflow-hidden transform-gpu" id="process">
            <div className="absolute inset-0 bg-brand-accent/5 pointer-events-none transform-gpu" style={{ maskImage: 'radial-gradient(circle at 50% 50%, black, transparent)' }} />

            <div className="max-w-6xl mx-auto" ref={containerRef}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Execution <span className="text-brand-accent">Pipeline</span></h2>
                    <p className="text-slate-400">Streamlined engineering methodology from concept to global deployment.</p>
                </motion.div>

                <div className="relative pt-4 pb-12">
                    {/* Vertical Progress Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 transform-gpu">
                        <motion.div
                            style={{ scaleY, originY: 0 }}
                            className="absolute top-0 w-full h-full bg-brand-accent shadow-[0_0_20px_rgba(0,242,255,0.8)] transform-gpu will-change-transform"
                        />
                    </div>

                    <div className="space-y-4 md:space-y-12">
                        {steps.map((step, index) => (
                            <TimelineStep key={index} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Timeline;
