"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const About = () => {
    const services = [
        {
            image: "/service-web.png", // Placeholder path
            buttonText: "View Projects",
            link: "#projects",
            gradient: "from-blue-600/20 to-cyan-500/20"
        },
        {
            image: "/service-hr.png", // Placeholder path
            buttonText: "Explore HR Platform",
            link: "#contact",
            gradient: "from-indigo-600/20 to-purple-500/20"
        },
        {
            image: "/service-auto.png", // Placeholder path
            buttonText: "See Automation",
            link: "#contact",
            gradient: "from-cyan-600/20 to-teal-500/20"
        }
    ];

    return (
        <section className="py-24 px-6 relative overflow-hidden" id="about">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}


                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group relative h-[450px] rounded-twelve overflow-hidden cursor-pointer"
                        >
                            {/* Card Background Image */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} bg-slate-900`}>
                                <Image
                                    src={service.image}
                                    fill
                                    alt={service.buttonText}
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 pattern-grid opacity-10"></div>
                            </div>

                            {/* Dark Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

                            {/* Hover Glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-brand-accent/5" />

                            {/* Content */}

                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
