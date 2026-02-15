"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float } from "@react-three/drei";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
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

const HeroInteractive = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [autoRotate] = useState(false);
    const [exploded] = useState(false);

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
                                onRotationChange={() => { }}
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
