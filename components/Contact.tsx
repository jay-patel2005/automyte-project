"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, PerspectiveCamera, Preload } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import toast, { Toaster } from 'react-hot-toast';

// --- Safe Canvas Wrapper ---
const SafeCanvas = ({ children, ...props }: React.ComponentProps<typeof Canvas>) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-full bg-transparent" />;

    return (
        <Canvas
            {...props}
            gl={{
                antialias: false,
                powerPreference: "high-performance",
                alpha: true,
                preserveDrawingBuffer: true
            }}
            dpr={[1, 1.5]}
            performance={{ min: 0.5 }}
        >
            <Suspense fallback={null}>
                {children}
                <Preload all />
            </Suspense>
        </Canvas>
    );
};

// --- 3D Visual: Network Node Sphere ---
const NetworkNodes = React.memo(() => {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate random points in a sphere
    const count = 1000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 2;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.002;
            pointsRef.current.rotation.x += 0.001;
            // Subtle floating movement
            pointsRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <group>
            <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00f2ff"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            {/* Soft inner glow sphere */}
            <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshStandardMaterial
                    color="#00f2ff"
                    transparent
                    opacity={0.05}
                    wireframe
                />
            </mesh>
        </group>
    );
});

NetworkNodes.displayName = "NetworkNodes";

const Contact = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

    const projectTypes = [
        "Smart Toll System",
        "Industrial Automation",
        "AI Monitoring",
        "IoT Infrastructure"
    ];

    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        projectType: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Message sent successfully! We\'ll get back to you soon.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#0a0f1a',
                        color: '#00f2ff',
                        border: '1px solid #00f2ff',
                    },
                });
                setFormData({
                    fullName: '',
                    companyName: '',
                    email: '',
                    projectType: '',
                    message: ''
                });
            } else {
                toast.error('Failed to send message. Please try again.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#0a0f1a',
                        color: '#ff4444',
                        border: '1px solid #ff4444',
                    },
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred. Please try again later.', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#0a0f1a',
                    color: '#ff4444',
                    border: '1px solid #ff4444',
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="py-32 px-6 relative overflow-hidden bg-brand-bg"
        >
            <Toaster />
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 blur-[80px] rounded-full pointer-events-none transform-gpu" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Side: 3D Visual & Info */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold leading-tight"
                        >
                            Let's Build <span className="text-brand-accent">Intelligent</span> <br />
                            Infrastructure Together
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-xl text-slate-300 font-medium"
                        >
                            Whether upgrading toll systems, automating industrial operations, or deploying AI-driven monitoring — our engineering team is ready.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-slate-400 leading-relaxed max-w-lg"
                        >
                            Automytee collaborates with enterprises and infrastructure operators to design scalable automation ecosystems engineered for precision and performance.
                        </motion.p>
                    </div>

                    {/* 3D Visual Container */}
                    <div className="relative h-[300px] md:h-[400px] w-full rounded-twelve overflow-hidden">
                        <motion.div
                            style={{ opacity, scale }}
                            className="absolute inset-0 z-0"
                        >
                            <SafeCanvas>
                                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
                                <directionalLight position={[-5, 5, 5]} intensity={0.5} />
                                <NetworkNodes />
                            </SafeCanvas>
                        </motion.div>
                        {/* Parallax Depth Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Contact Info Chips */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Location", val: "Gujarat, India" },
                            { label: "Email", val: "info@automytee.tech" },
                            { label: "Support", val: "24/7 Tech Intel" }
                        ].map((info, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="p-4 glass-morphism rounded-twelve border border-white/5"
                            >
                                <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-1">{info.label}</p>
                                <p className="text-sm font-semibold text-slate-200">{info.val}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="glass-morphism p-8 md:p-12 rounded-twelve border border-brand-accent/20 relative"
                >
                    {/* Soft grain overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] rounded-twelve" />

                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full bg-brand-bg/50 border border-white/10 rounded-twelve px-4 py-3 focus:border-brand-accent outline-none transition-all text-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Infrastructure Corp"
                                    className="w-full bg-brand-bg/50 border border-white/10 rounded-twelve px-4 py-3 focus:border-brand-accent outline-none transition-all text-slate-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@company.com"
                                required
                                className="w-full bg-brand-bg/50 border border-white/10 rounded-twelve px-4 py-3 focus:border-brand-accent outline-none transition-all text-slate-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Type</label>
                            <select
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleChange}
                                className="w-full bg-brand-bg/50 border border-white/10 rounded-twelve px-4 py-3 focus:border-brand-accent outline-none transition-all text-slate-300 appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select a project type</option>
                                {projectTypes.map((type) => (
                                    <option key={type} value={type} className="bg-brand-bg text-slate-300">{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Description</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about your automation requirements..."
                                required
                                className="w-full bg-brand-bg/50 border border-white/10 rounded-twelve px-4 py-3 focus:border-brand-accent outline-none transition-all text-slate-200 resize-none"
                            ></textarea>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 242, 255, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-brand-accent text-brand-bg font-bold rounded-twelve uppercase tracking-[0.2em] text-sm shadow-inner transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Sending...' : 'Request Consultation'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
