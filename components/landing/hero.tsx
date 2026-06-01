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
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              <span className="text-foreground">AI Data Marketplace</span>
              <br />
              <span className="brand-gradient-text-hero">
                for Amharic Language
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl"
            >
              Collect, Annotate, Validate, and Sell High-Quality Amharic Datasets
              using AI-powered workflows and crowdsourcing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-start gap-4"
            >
              <Link
                href="/register"
                className="group relative w-full sm:w-auto px-8 py-4 text-base font-semibold text-white brand-gradient-btn rounded-2xl shadow-2xl brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#marketplace"
                className="group w-full sm:w-auto px-8 py-4 text-base font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-border/50 rounded-2xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 brand-text" />
                Explore Marketplace
              </Link>
            </motion.div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { value: "10K+", label: "Datasets", delay: 0.6 },
                { value: "50K+", label: "Contributors", delay: 0.7 },
                { value: "99.2%", label: "Quality Score", delay: 0.8 },
                { value: "1M+", label: "Annotations", delay: 0.9 },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  className="p-6 sm:p-8 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-xl shadow-xl hover:bg-card/60 transition-all hover:-translate-y-1 group"
                >
                  <div className="text-2xl sm:text-4xl font-bold brand-gradient-text-soft mb-1 group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative background glow for metrics */}
            <div className="absolute -inset-4 z-[-1] brand-bg opacity-[0.03] blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
