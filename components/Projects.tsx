"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";



interface Project {
    _id: string;
    title: string;
    description: string;
    image?: string;
    technologies: string[];
    link?: string;
    github?: string;
}

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
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
                className="glass-morphism rounded-twelve border border-white/10 overflow-hidden solution-card h-full flex flex-col"
            >
                <div className="relative aspect-video overflow-hidden">
                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-all duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <span className="text-slate-500">No Image</span>
                        </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-bg/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center">
                        <div className="flex gap-4">
                            {project.link && (
                                <motion.a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ y: 20, opacity: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={rotate.x !== 0 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                                    className="px-6 py-2 bg-brand-accent text-brand-bg font-bold rounded-twelve text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                                >
                                    Live Demo
                                </motion.a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-4 flex-grow flex flex-col">
                    <div className="flex flex-wrap gap-2">
                        {project.technologies && project.technologies.map((t) => (
                            <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-brand-accent px-2 py-1 rounded bg-brand-accent/10 border border-brand-accent/20">
                                {t}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-brand-accent transition-colors">{project.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-auto">{project.description}</p>
                </div>
            </motion.div>

            {/* Floating Glow */}
            <div className="absolute -inset-2 bg-brand-accent/5 blur-2xl rounded-twelve opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
        </motion.div>
    );
};

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.success) {
                    setProjects(data.data);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section className="py-24 px-6 relative overflow-hidden min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin"></div>
                    <p className="text-brand-accent font-mono text-sm">LOADING PROJECTS SYSTEM...</p>
                </div>
            </section>
        );
    }

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

                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard key={index} project={project} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-twelve border border-white/10 backdrop-blur-sm">
                        <div className="text-3xl mb-4">🚧</div>
                        <h3 className="text-xl font-bold text-white mb-2">No Projects Deployed Yet</h3>
                        <p className="text-slate-400">Our latest industrial deployments will appear here soon.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
