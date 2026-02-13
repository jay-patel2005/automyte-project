"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

const projects = [
    {
        title: "Highway X Infrastructure",
        desc: "Our flagship deployment utilizing Edge AI for 99.9% accuracy in high-velocity environments.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzZggewlldeJnr5KaBhQ7AcJVJh1VnMNuSIHozCXv3bWUKCfWtsumUDlMp70J6epniQgllLZ_5J9S6bxXvMJvboiG896x2p0VUAG8D5kkrwFivmULwJfCgP24HRbP2OgRJVylYwSYonu0ECRmmfSFBTguOURDSY8s_OBvkmmwNW2O0-H7e6IsetL0Mq5zca7YLDGPJQf3Z3PJjMLVRSqaoN6g3tgRoOXp9mtpFk6gH1w5cNX04kAVre8RiEkCSC-QOs8LUSp1HWVI",
        tech: ["Edge AI", "IoT", "TensorFlow", "React"],
        link: "#",
        github: "#"
    },
    {
        title: "Smart Logistics Hub",
        desc: "Autonomous robotic orchestration for zero-touch warehousing and real-time inventory tracking.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABZDMGYIFRv1aNfneax5xXU9qVnHvhXtg_dA4ljcijxibAE3f2BwIUqJ2WhaC9BqUbWA09FjUbnoDD2y8YTxNBIfygqtuEN9zJHvKkUR1kkaIMR8UFt7zioGLyDAgV6M1it9cdS79F6s5XdgWM08PL_-3pr8F0v5ypTHnmAeak0X0h-lgL6YbatyT57jgOL-fSNuZpE4CyhDuyIDhuGiSGi8nz3varczPvBoix2FN90_tw4jLkh6rmtTS42HDLq1-fSRgwrHQIjlc",
        tech: ["ROS2", "Python", "Cloud Vision", "Next.js"],
        link: "#",
        github: "#"
    },
    {
        title: "Neuro-Surveillance System",
        desc: "Next-gen security protocols using deep learning for predictive anomaly detection.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzZggewlldeJnr5KaBhQ7AcJVJh1VnMNuSIHozCXv3bWUKCfWtsumUDlMp70J6epniQgllLZ_5J9S6bxXvMJvboiG896x2p0VUAG8D5kkrwFivmULwJfCgP24HRbP2OgRJVylYwSYonu0ECRmmfSFBTguOURDSY8s_OBvkmmwNW2O0-H7e6IsetL0Mq5zca7YLDGPJQf3Z3PJjMLVRSqaoN6g3tgRoOXp9mtpFk6gH1w5cNX04kAVre8RiEkCSC-QOs8LUSp1HWVI",
        tech: ["PyTorch", "Kubernetes", "WebSockets", "D3.js"],
        link: "#",
        github: "#"
    }
];

const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
            }}
            className="relative group"
        >
            <motion.div
                animate={{
                    rotateX: rotate.x,
                    rotateY: rotate.y,
                    scale: rotate.x !== 0 ? 1.02 : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-morphism rounded-twelve border border-white/10 overflow-hidden solution-card"
            >
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-bg/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center">
                        <div className="flex gap-4">
                            <motion.a
                                href={project.link}
                                initial={{ y: 20, opacity: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={rotate.x !== 0 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                                className="px-6 py-2 bg-brand-accent text-brand-bg font-bold rounded-twelve text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                            >
                                Live Demo
                            </motion.a>
                            <motion.a
                                href={project.github}
                                initial={{ y: 20, opacity: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={rotate.x !== 0 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                                className="px-6 py-2 glass-morphism border border-white/20 text-white font-bold rounded-twelve text-sm uppercase tracking-wider"
                            >
                                Source
                            </motion.a>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                            <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-brand-accent px-2 py-1 rounded bg-brand-accent/10 border border-brand-accent/20">
                                {t}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-brand-accent transition-colors">{project.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{project.desc}</p>
                </div>
            </motion.div>

            {/* Floating Glow */}
            <div className="absolute -inset-2 bg-brand-accent/5 blur-2xl rounded-twelve opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
        </motion.div>
    );
};

const Projects = () => {
    return (
        <section className="py-24 px-6 relative overflow-hidden" id="projects">
            {/* Background Depth Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 blur-[80px] rounded-full pointer-events-none transform-gpu"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-6xl font-bold mb-4">
                        Industrial <span className="text-brand-accent">Deployments</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Battle-tested automation systems architected for the most demanding environments globally.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
