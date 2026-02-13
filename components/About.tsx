"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera, MeshWobbleMaterial } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

const MechanicalCluster = React.memo(() => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.z += 0.002;
        }
    });

    const boxes = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
            ] as [number, number, number],
            scale: Math.random() * 0.5 + 0.1,
        }));
    }, []);

    return (
        <group ref={meshRef}>
            {boxes.map((box, i) => (
                <mesh key={i} position={box.position}>
                    <boxGeometry args={[box.scale, box.scale, box.scale]} />
                    <meshStandardMaterial
                        color="#00f2ff"
                        wireframe
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            ))}
            <mesh>
                <sphereGeometry args={[1.2, 32, 32]} />
                <MeshDistortMaterial
                    color="#00f2ff"
                    speed={2}
                    distort={0.4}
                    radius={1}
                    wireframe
                />
            </mesh>
        </group>
    );
});

MechanicalCluster.displayName = "MechanicalCluster";

const SafeCanvas = ({ children, ...props }: any) => {
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
            {children}
        </Canvas>
    );
};

const About = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const capabilities = [
        "Intelligent Smart Toll Management",
        "Computer Vision & AI Monitoring",
        "Industrial Robotics & Control Systems",
        "Edge-to-Cloud Infrastructure",
        "Predictive Data Analytics",
        "24/7 System Intelligence & Support",
    ];

    return (
        <section
            ref={sectionRef}
            className="py-32 px-6 relative overflow-hidden"
            id="about"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/10 blur-[80px] rounded-full pointer-events-none transform-gpu" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Side: 3D Visual */}
                <div className="relative h-[400px] lg:h-[600px] w-full cursor-grab active:cursor-grabbing">
                    <motion.div
                        style={{ opacity, y }}
                        className="absolute inset-0 z-0"
                    >
                        <SafeCanvas>
                            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
                            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                                <MechanicalCluster />
                            </Float>
                        </SafeCanvas>
                    </motion.div>

                    {/* Parallax Overlay */}
                    <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-twelve" />
                </div>

                {/* Right Side: Content Block */}
                <div className="space-y-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Engineering <span className="text-brand-accent">Precision</span>. <br />
                            Delivering Intelligent <span className="text-brand-accent">Automation</span>.
                        </h2>
                        <p className="text-xl text-slate-300 font-medium">
                            Automytee is a technology-driven automation company building high-performance smart infrastructure systems for modern industries.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="glass-morphism p-8 md:p-10 rounded-twelve border border-brand-accent/20 space-y-6"
                    >
                        <p className="text-slate-400 leading-relaxed">
                            At Automytee, we design intelligent automation ecosystems that connect hardware, software, and real-time data into a unified operational framework.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Our expertise spans smart toll infrastructure, AI-powered monitoring systems, industrial process automation, and scalable IoT architectures.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {capabilities.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(0,242,255,1)] group-hover:scale-150 transition-transform" />
                                    <span className="text-sm font-semibold tracking-wide text-slate-200">{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <p className="text-slate-500 italic text-sm">
                                Every solution is built with precision, real-time intelligence, and mission-critical reliability at its core.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
