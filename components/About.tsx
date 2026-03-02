"use client";

import React from "react";
import { motion } from "framer-motion";

const About = () => {
    const highlights = ["Web Development", "Business Automation", "SaaS Platforms", "E-commerce", "API Integration"];

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-brand-bg" id="about">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-xs font-bold tracking-[0.2em] uppercase">
                            Who We Are
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
                            We Build Digital Solutions That Actually <span className="text-brand-accent">Work.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-5 text-slate-400 text-lg leading-relaxed"
                    >
                        <p>
                            We are <span className="text-white font-semibold">Automyte</span> — a lean, focused team of developers and automation experts. We help businesses grow online by building fast websites, custom web apps, and smart automations.
                        </p>
                        <p>
                            Whether you're a startup looking for your first website, or an established company wanting to automate your operations — we've got you covered. No fluff, just clean and reliable work.
                        </p>
                        {/* Highlight tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {highlights.map((tag, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    viewport={{ once: true }}
                                    className="px-3 py-1 text-xs font-semibold rounded-full border border-brand-accent/20 text-brand-accent bg-brand-accent/5"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-twelve glass-morphism border border-brand-accent/20 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-brand-accent/50 group-hover:bg-brand-accent transition-colors duration-300" />
                        <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                        <p className="text-slate-400 leading-relaxed">
                            To help every business — big or small — get the digital tools they need to grow. We make technology simple, affordable, and actually useful for the people who use it every day.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-twelve glass-morphism border border-brand-accent/20 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-brand-accent/50 group-hover:bg-brand-accent transition-colors duration-300" />
                        <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                        <p className="text-slate-400 leading-relaxed">
                            A world where every business runs smarter. We envision a future where automation and intelligent web systems free teams from repetitive tasks, so they can focus on what truly matters — growing their business.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;

