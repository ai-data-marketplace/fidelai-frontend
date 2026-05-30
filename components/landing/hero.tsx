"use client";

import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

function Particles({ count = 200 }) {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const t = Math.random();
      col[i * 3] = 1.0;
      col[i * 3 + 1] = 0.5 + t * 0.3;
      col[i * 3 + 2] = 0.1 + t * 0.1;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    mesh.current.rotation.x =
      Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.15;
    ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.5, 0.02, 16, 100]} />
      <meshBasicMaterial color="#f97316" transparent opacity={0.7} />
    </mesh>
  );
}

function FloatingRing2() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    ref.current.rotation.x =
      Math.PI / 3 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[3.2, 0.015, 16, 100]} />
      <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.0} />
      <Particles count={300} />
      <FloatingRing />
      <FloatingRing2 />
    </>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          style={{ background: "transparent" }}
          dpr={[1, 1.5]}
        >
          <Scene />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background via-background/40 to-background" />
      <div className="absolute inset-0 z-[1] brand-radial-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full brand-chip-soft text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full brand-bg-soft opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 brand-bg" />
          </span>
          FidelAi - Next Gen Ai Data Hub
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-foreground">AI Data Marketplace</span>
          <br />
          <span className="brand-gradient-text-hero">for Amharic Language</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10"
        >
          Collect, Annotate, Validate, and Sell High-Quality Amharic Datasets
          using AI-powered workflows and crowdsourcing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="group relative px-8 py-4 text-base font-semibold text-white brand-gradient-btn rounded-2xl shadow-2xl brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#marketplace"
            className="group px-8 py-4 text-base font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-border/50 rounded-2xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Play className="w-4 h-4 brand-text" />
            Explore Marketplace
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "10K+", label: "Datasets" },
            { value: "50K+", label: "Contributors" },
            { value: "99.2%", label: "Quality Score" },
            { value: "1M+", label: "Annotations" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold brand-gradient-text-soft">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full brand-bg" />
        </motion.div>
      </motion.div>
    </section>
  );
}
