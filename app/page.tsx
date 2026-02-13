"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroInteractive from "@/components/HeroInteractive";
import Solutions from "@/components/Solutions";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import dynamic from "next/dynamic";

const AboutSection = dynamic(() => import("@/components/About"), {
  ssr: false,
  loading: () => <div className="h-[600px] flex items-center justify-center text-brand-accent text-xl font-bold">Initializing Systems...</div>
});

export default function Home() {
  const [modalData, setModalData] = useState<{ isOpen: boolean; title: string; desc: string }>({
    isOpen: false,
    title: "",
    desc: ""
  });

  const openModal = (title: string, desc: string) => {
    setModalData({ isOpen: true, title, desc });
  };

  const closeModal = () => {
    setModalData({ ...modalData, isOpen: false });
  };

  return (
    <main className="min-h-screen relative bg-brand-bg">
      {/* Global Animated Gradient Backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-brand-bg">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-accent/10 blur-[80px] rounded-full transform-gpu will-change-transform"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-brand-accent/5 blur-[60px] rounded-full transform-gpu will-change-transform"
        />
      </div>

      <Navbar />

      <div>
        <HeroInteractive />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <AboutSection />
        </motion.div>

        <Solutions />

        {/* Project Section with Floating Animation */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Projects />
        </motion.div>

        <Timeline />

        <Stats />

        <Contact />
      </div>

      <Footer />

      <AnimatePresence>
        {modalData.isOpen && (
          <Modal
            isOpen={modalData.isOpen}
            onClose={closeModal}
            title={modalData.title}
            description={modalData.desc}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
