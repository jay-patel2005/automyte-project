"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera, Preload } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// --- Components ---

const SafeCanvas = ({ children, ...props }: any) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-full" />;

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

const BackgroundNode = React.memo(() => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.001;
            meshRef.current.rotation.z += 0.0005;
        }
    });

    const lines = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 20; i++) {
            temp.push({
                position: [
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                ] as [number, number, number],
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
                scale: Math.random() * 2 + 1
            });
        }
        return temp;
    }, []);

    return (
        <group ref={meshRef}>
            {lines.map((item, i) => (
                <mesh key={i} position={item.position} rotation={item.rotation}>
                    <octahedronGeometry args={[item.scale, 0]} />
                    <meshStandardMaterial
                        color="#00f2ff"
                        wireframe
                        transparent
                        opacity={0.05}
                    />
                </mesh>
            ))}
        </group>
    );
});

BackgroundNode.displayName = "BackgroundNode";

const Card3DBackground = React.memo(({ active }: { active: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[5, 5, 32, 32]} />
            <MeshDistortMaterial
                color="#00f2ff"
                speed={active ? 3 : 1}
                distort={active ? 0.3 : 0.1}
                radius={1}
                transparent
                opacity={0.1}
                wireframe
            />
        </mesh>
    );
});

Card3DBackground.displayName = "Card3DBackground";

const SolutionCard = ({
    title,
    description,
    features,
    index
}: {
    title: string;
    description: string;
    features: string[];
    index: number;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 100, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const x = (e.clientX - rect.left) / width - 0.5;
        const y = (e.clientY - rect.top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
            }}
            className="relative group"
        >
            <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 transform-gpu overflow-hidden">
                <SafeCanvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
                    <Card3DBackground active={isHovered} />
                </SafeCanvas>
            </div>

            <motion.div
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={`relative h-full glass-morphism p-8 rounded-twelve border border-white/5 transition-colors duration-500 overflow-hidden transform-gpu backface-hidden ${isHovered ? "border-brand-accent/40" : ""
                    }`}
            >

                {/* Content */}
                <div className="relative z-10 space-y-6">
                    <div className="space-y-2">
                        <div className={`w-12 h-1 bg-brand-accent transition-all duration-500 ${isHovered ? "w-24" : "w-12"}`} />
                        <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed min-h-[60px]">
                        {description}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="flex items-center gap-2 group/item"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/50 group-hover/item:bg-brand-accent transition-colors" />
                                <span className="text-xs font-medium text-slate-300 group-hover/item:text-slate-100 transition-colors">
                                    {feature}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest pt-4 group-hover:gap-4 transition-all"
                    >
                        Explore Module
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                    </motion.button>
                </div>

                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-brand-accent/5 blur-[50px] transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`} />
            </motion.div>
        </motion.div>
    );
};

const Solutions = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const solutionsData = [
        {
            title: "Smart Toll Automation",
            description: "High-speed AI-powered toll systems designed for seamless traffic flow and real-time vehicle intelligence.",
            features: [
                "Computer vision vehicle detection",
                "Automatic barrier systems",
                "Revenue analytics",
                "Cloud monitoring"
            ]
        },
        {
            title: "Industrial Process Automation",
            description: "Advanced PLC and robotic system integration for optimized operations.",
            features: [
                "Industrial controllers",
                "Robotics coordination",
                "Live dashboards",
                "Predictive maintenance"
            ]
        },
        {
            title: "AI Surveillance & Monitoring",
            description: "Computer vision systems built for intelligent monitoring environments.",
            features: [
                "License plate recognition",
                "Behavior detection",
                "Edge AI inference",
                "Central command dashboards"
            ]
        },
        {
            title: "IoT & Edge Infrastructure",
            description: "Scalable IoT ecosystems connecting distributed automation networks.",
            features: [
                "Edge-to-cloud architecture",
                "Secure API integration",
                "Microservices backend",
                "Low-latency communication"
            ]
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="py-32 px-6 relative overflow-hidden bg-brand-bg select-none"
            id="solutions"
        >
            {/* Background 3D Node */}
            <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none transform-gpu">
                <SafeCanvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={0.5} />
                    <BackgroundNode />
                </SafeCanvas>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="mb-20 space-y-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-[10px] font-bold tracking-[0.2em] uppercase"
                    >
                        Frameworks & Systems
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight"
                    >
                        Intelligent Solutions. <br />
                        <span className="text-brand-accent">Engineered for Performance.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl"
                    >
                        Scalable automation architectures designed for mission-critical infrastructure and modern industrial ecosystems.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {solutionsData.map((solution, index) => (
                        <SolutionCard
                            key={index}
                            index={index}
                            {...solution}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />
        </section>
    );
};

export default Solutions;

