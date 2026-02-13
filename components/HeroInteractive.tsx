"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";

// Safe Canvas wrapper
const SafeCanvas = ({ children, ...props }: React.ComponentProps<typeof Canvas>) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
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
            <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
    );
};

// Interactive 3D Model with enhanced visuals
const InteractiveModel = React.memo(({
    autoRotate,
    exploded,
    onRotationChange,
    scrollProgress
}: {
    autoRotate: boolean;
    exploded: boolean;
    onRotationChange: (rotation: number) => void;
    scrollProgress: number;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current) {
            // Auto-rotate when enabled
            if (autoRotate) {
                groupRef.current.rotation.y += 0.005;
            }

            // Scroll-based subtle rotation
            const scrollRotation = scrollProgress * Math.PI * 0.5;
            groupRef.current.rotation.x = Math.sin(scrollRotation) * 0.1;

            // Floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

            // Report rotation
            const rotation = (groupRef.current.rotation.y * 180 / Math.PI) % 360;
            onRotationChange(rotation);
        }
    });

    // Exploded view offset
    const explosionScale = exploded ? 1.5 : 1;

    return (
        <group ref={groupRef}>
            {/* Central Core */}
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
                <mesh
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    scale={hovered ? 1.1 : 1}
                >
                    <icosahedronGeometry args={[1.2, 1]} />
                    <meshStandardMaterial
                        color="#00f2ff"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#00f2ff"
                        emissiveIntensity={hovered ? 0.8 : 0.5}
                    />
                </mesh>
            </Float>

            {/* Orbiting Rings - Exploded View */}
            {[0, 60, 120].map((rotation, i) => (
                <group
                    key={i}
                    rotation={[0, 0, (rotation * Math.PI) / 180]}
                    position={[0, 0, exploded ? (i - 1) * 0.5 : 0]}
                >
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
            {Array.from({ length: 15 }).map((_, i) => {
                const angle = (i / 15) * Math.PI * 2;
                const radius = 3 * explosionScale;
                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * radius,
                            (Math.random() - 0.5) * 2,
                            Math.sin(angle) * radius,
                        ]}
                    >
                        <sphereGeometry args={[0.04, 8, 8]} />
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

InteractiveModel.displayName = "InteractiveModel";

// 3D Scene with enhanced lighting
const Scene3D = React.memo(({
    autoRotate,
    exploded,
    onRotationChange,
    scrollProgress,
    cameraDistance
}: {
    autoRotate: boolean;
    exploded: boolean;
    onRotationChange: (rotation: number) => void;
    scrollProgress: number;
    cameraDistance: number;
}) => {
    const { camera } = useThree();

    useFrame(() => {
        // Scroll-based camera zoom
        camera.position.z = 8 - scrollProgress * 2;
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, cameraDistance]} fov={50} />

            {/* Enhanced Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1.5}
                color="#00f2ff"
                castShadow
            />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0066ff" />
            <spotLight
                position={[0, 10, 0]}
                angle={0.3}
                penumbra={1}
                intensity={1.2}
                color="#00f2ff"
            />

            {/* Environment for reflections */}
            <Environment preset="night" />

            {/* Interactive Model */}
            <InteractiveModel
                autoRotate={autoRotate}
                exploded={exploded}
                onRotationChange={onRotationChange}
                scrollProgress={scrollProgress}
            />

            {/* Orbit Controls */}
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={5}
                maxDistance={12}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
            />
        </>
    );
});

Scene3D.displayName = "Scene3D";

// Control Panel Component
const ControlPanel = ({
    rotation,
    zoom,
    autoRotate,
    setAutoRotate,
    exploded,
    setExploded,
    systemMode,
    setSystemMode
}: {
    rotation: number;
    zoom: number;
    autoRotate: boolean;
    setAutoRotate: (val: boolean) => void;
    exploded: boolean;
    setExploded: (val: boolean) => void;
    systemMode: string;
    setSystemMode: (mode: string) => void;
}) => {
    const modes = ["Simulation", "Live", "Demo"];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-morphism p-6 rounded-twelve border border-brand-accent/20 space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-brand-accent">System Control</h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-slate-400">ONLINE</span>
                </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Rotation</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-brand-accent">
                            {Math.abs(Math.round(rotation))}
                        </p>
                        <span className="text-xs text-slate-400">deg</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Zoom</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-brand-accent">
                            {zoom.toFixed(1)}
                        </p>
                        <span className="text-xs text-slate-400">x</span>
                    </div>
                </div>
            </div>

            {/* System Mode Selector */}
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-slate-500">System Mode</p>
                <div className="grid grid-cols-3 gap-2">
                    {modes.map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setSystemMode(mode)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${systemMode === mode
                                ? "bg-brand-accent text-brand-bg shadow-[0_0_20px_rgba(0,242,255,0.5)]"
                                : "bg-white/5 text-slate-400 hover:bg-white/10"
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggle Controls */}
            <div className="space-y-3">
                {/* Auto Rotate */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                            Auto Rotate
                        </span>
                    </div>
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`relative w-12 h-6 rounded-full transition-all ${autoRotate ? "bg-brand-accent" : "bg-white/20"
                            }`}
                    >
                        <motion.div
                            animate={{ x: autoRotate ? 24 : 0 }}
                            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
                        />
                    </button>
                </div>

                {/* Exploded View */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                            Exploded View
                        </span>
                    </div>
                    <button
                        onClick={() => setExploded(!exploded)}
                        className={`relative w-12 h-6 rounded-full transition-all ${exploded ? "bg-brand-accent" : "bg-white/20"
                            }`}
                    >
                        <motion.div
                            animate={{ x: exploded ? 24 : 0 }}
                            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
                        />
                    </button>
                </div>
            </div>

            {/* Performance Indicator */}
            <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-slate-500">Performance</span>
                    <span className="text-xs font-bold text-green-400">60 FPS</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-brand-accent to-green-400"
                    />
                </div>
            </div>
        </motion.div>
    );
};

const HeroInteractive = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1.0);
    const [autoRotate, setAutoRotate] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [systemMode, setSystemMode] = useState("Simulation");

    // Track scroll progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (latest) => {
            setScrollProgress(latest);
            setZoom(1 + latest * 0.5);
        });
        return () => unsubscribe();
    }, [smoothProgress]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden py-32 bg-no-repeat bg-cover bg-center"
            id="home"
            style={{ backgroundImage: "url('/hero-bg.png')" }}
        >
            {/* Background Overlay for readability */}
            <div className="absolute inset-0 bg-brand-bg/80 z-0"></div>

            {/* Background Ambient Glow */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/20 blur-[80px] rounded-full animate-glow-pulse transform-gpu will-change-transform z-0" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="space-y-8"
                >
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
                </motion.div>

                {/* Right: 3D Interactive Area */}
                <div className="relative space-y-6">
                    {/* 3D Canvas */}
                    <div className="relative h-[400px] lg:h-[600px] w-full rounded-twelve overflow-hidden border border-brand-accent/20">
                        <SafeCanvas>
                            <Scene3D
                                autoRotate={autoRotate}
                                exploded={exploded}
                                onRotationChange={setRotation}
                                scrollProgress={scrollProgress}
                                cameraDistance={8}
                            />
                        </SafeCanvas>

                        {/* Interaction Hint */}
                        <AnimatePresence>
                            {!autoRotate && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 glass-morphism rounded-full border border-brand-accent/30 text-xs text-slate-400"
                                >
                                    Drag to rotate • Scroll to zoom
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroInteractive;
