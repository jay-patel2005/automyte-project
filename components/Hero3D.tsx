"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF, Environment, Float } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";

// Safe Canvas wrapper to prevent SSR issues
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
                antialias: true,
                powerPreference: "high-performance",
                alpha: true,
                preserveDrawingBuffer: true,
            }}
            dpr={[1, 1.5]}
            performance={{ min: 0.5 }}
        >
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </Canvas>
    );
};

// 3D Model Component with scroll-based animation
const AnimatedModel = React.memo(({ scrollProgress }: { scrollProgress: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    // Smooth scroll-based rotation and position
    useFrame(() => {
        if (groupRef.current) {
            // Rotate based on scroll (0 to 360 degrees in first section)
            groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
            groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.2;

            // Scale effect on scroll
            const scale = 1 + scrollProgress * 0.3;
            groupRef.current.scale.setScalar(scale);

            // Subtle floating animation
            groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Central Core - Futuristic Geometric Shape */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
                <mesh>
                    <icosahedronGeometry args={[1.2, 1]} />
                    <meshStandardMaterial
                        color="#00f2ff"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#00f2ff"
                        emissiveIntensity={0.5}
                        wireframe={false}
                    />
                </mesh>
            </Float>

            {/* Orbiting Rings */}
            {[0, 60, 120].map((rotation, i) => (
                <group key={i} rotation={[0, 0, (rotation * Math.PI) / 180]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[2 + i * 0.3, 0.02, 16, 100]} />
                        <meshStandardMaterial
                            color="#00f2ff"
                            metalness={0.8}
                            roughness={0.2}
                            emissive="#00f2ff"
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                </group>
            ))}

            {/* Floating Particles */}
            {Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const radius = 3;
                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * radius,
                            (Math.random() - 0.5) * 2,
                            Math.sin(angle) * radius,
                        ]}
                    >
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshStandardMaterial
                            color="#00f2ff"
                            emissive="#00f2ff"
                            emissiveIntensity={1}
                        />
                    </mesh>
                );
            })}
        </group>
    );
});

AnimatedModel.displayName = "AnimatedModel";

// 3D Scene Component
const Scene3D = React.memo(({ scrollProgress }: { scrollProgress: number }) => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
            <spotLight
                position={[0, 10, 0]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                color="#00f2ff"
            />

            {/* Environment for reflections */}
            <Environment preset="night" />

            {/* Animated 3D Model */}
            <AnimatedModel scrollProgress={scrollProgress} />
        </>
    );
});

Scene3D.displayName = "Scene3D";

const Hero3D = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Track scroll progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Smooth spring animation for scroll
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (latest) => {
            setScrollProgress(latest);
        });
        return () => unsubscribe();
    }, [smoothProgress]);

    // Download 3D model function
    const handleDownload3DModel = () => {
        // Create a simple OBJ file content (you can replace with actual model)
        const objContent = `# Automytee 3D Model
# Futuristic Automation System
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 0.5 1.0 0.0
f 1 2 3
`;
        const blob = new Blob([objContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "automytee-model.obj";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-brand-bg"
            id="home"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-[#0a0e16] to-brand-bg pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-accent/10 blur-[100px] rounded-full animate-glow-pulse transform-gpu will-change-transform" />

            {/* 3D Canvas - Fixed Container */}
            <div className="absolute inset-0 z-0">
                <SafeCanvas>
                    <Scene3D scrollProgress={scrollProgress} />
                </SafeCanvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-[0.2em] uppercase">
                            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                            Next-Gen Engineering
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter">
                            Architecting <br />
                            <span className="text-brand-accent">Autonomous</span>
                            <br />
                            Intelligence
                        </h1>

                        <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-light">
                            High-integrity automation systems for global infrastructure. We bridge the
                            physical and digital with precision engineering.
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <Link
                                href="#projects"
                                className="px-10 py-5 bg-brand-accent text-brand-bg font-bold rounded-twelve accent-glow hover:scale-105 transition-all uppercase tracking-wider text-sm"
                            >
                                View Systems
                            </Link>
                            <Link
                                href="#contact"
                                className="px-10 py-5 glass-morphism font-bold rounded-twelve hover:bg-white/10 transition-all border border-white/10 uppercase tracking-wider text-sm"
                            >
                                Consultancy
                            </Link>
                        </div>

                        {/* Download 3D Model Button */}
                        <motion.button
                            onClick={handleDownload3DModel}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-6 py-3 glass-morphism rounded-twelve border border-brand-accent/30 hover:border-brand-accent/60 transition-all group"
                        >
                            <svg
                                className="w-5 h-5 text-brand-accent"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                />
                            </svg>
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-300 group-hover:text-brand-accent transition-colors">
                                Download 3D Model
                            </span>
                        </motion.button>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                            className="flex items-center gap-2 text-slate-500 text-sm"
                        >
                            <span>Scroll to explore</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.div>
                    </motion.div>

                    {/* Right: 3D Model Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="hidden lg:block"
                    >
                        <div className="glass-morphism p-8 rounded-twelve border border-brand-accent/20 space-y-4">
                            <h3 className="text-2xl font-bold text-brand-accent">Interactive 3D Model</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Scroll to see the model rotate and transform. This represents our
                                intelligent automation core - a fusion of hardware, software, and AI.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-wider text-slate-500">Rotation</p>
                                    <p className="text-2xl font-bold text-brand-accent">
                                        {Math.round(scrollProgress * 360)}°
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-wider text-slate-500">Scale</p>
                                    <p className="text-2xl font-bold text-brand-accent">
                                        {(1 + scrollProgress * 0.3).toFixed(2)}x
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Progress Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                <div className="w-1 h-24 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        style={{ scaleY: smoothProgress }}
                        className="w-full h-full bg-brand-accent origin-top transform-gpu will-change-transform"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero3D;
