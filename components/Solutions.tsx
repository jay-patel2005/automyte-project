"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Preload } from "@react-three/drei";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import * as THREE from "three";
import Image from "next/image";

// --- Components ---

const SafeCanvas = ({ children, ...props }: React.ComponentProps<typeof Canvas>) => {
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

    useFrame(() => {
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

const SolutionCard = ({
    title,
    description,
    features,
    image,
    cta,
    index
}: {
    title: string;
    description: string;
    features: string[];
    image: string;
    cta: string;
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
            className="relative group h-full"
        >
            <motion.div
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={`relative h-full glass-morphism p-8 rounded-twelve border border-white/5 transition-all duration-500 overflow-hidden transform-gpu backface-hidden ${isHovered ? "border-brand-accent/40" : ""
                    }`}
            >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 -z-10 bg-slate-950/70 group-hover:bg-slate-950/50 transition-colors duration-500" />
                <div className="absolute inset-0 -z-20 overflow-hidden rounded-twelve">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className={`object-cover transition-transform duration-700 ease-out ${isHovered ? "scale-110" : "scale-100"}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-6 flex flex-col h-full">
                    <div className="space-y-2">
                        <div className={`w-12 h-1 bg-brand-accent transition-all duration-500 ${isHovered ? "w-24" : "w-12"}`} />
                        <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed min-h-[60px]">
                        {description}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/10 flex-grow">
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
                        className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest pt-4 group-hover:gap-4 transition-all mt-auto"
                    >
                        {cta}
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

    const solutionsData = [
        {
            title: "Modern Website Development",
            description: "High-performance responsive websites that convert and scale.",
            features: [
                "Corporate Websites",
                "Landing Pages",
                "SEO Optimization",
                "Performance Focus"
            ],
            image: "/webdev.png",
            cta: "Explore Websites"
        },
        {
            title: "Web Applications & SaaS",
            description: "Custom dashboards and business systems tailored to your operations.",
            features: [
                "HR Systems",
                "Admin Panels",
                "CRM Platforms",
                "Secure Access Control"
            ],
            image: "/webapp.png",
            cta: "View Web Apps"
        },
        {
            title: "E-commerce Platforms",
            description: "Conversion-focused online stores built for scalability.",
            features: [
                "Product Management",
                "Payment Integration",
                "Multi-Vendor Setup",
                "Analytics"
            ],
            image: "/ecom.png",
            cta: "Explore E-commerce"
        },
        {
            title: "Business Automation",
            description: "Automate operations and connect systems using smart workflows.",
            features: [
                "n8n Automation",
                "WhatsApp Automation",
                "API Integration",
                "Lead Management"
            ],
            image: "/auto.png",
            cta: "See Automation"
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
                        Digital Transformation
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight"
                    >
                        Digital Solutions. <br />
                        <span className="text-brand-accent">Built for Modern Businesses.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl"
                    >
                        We design scalable web systems and automation architectures that help businesses grow smarter.
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
