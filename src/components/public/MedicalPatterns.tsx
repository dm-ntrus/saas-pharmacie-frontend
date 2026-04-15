"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface PatternProps {
  className?: string;
  opacity?: number;
}

export function MolecularPattern({ className = "", opacity = 0.03 }: PatternProps) {
  return (
    <svg className={className} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="molecular" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="3" fill="#059669" opacity={opacity} />
          <circle cx="40" cy="10" r="2" fill="#059669" opacity={opacity * 0.8} />
          <circle cx="70" cy="10" r="2.5" fill="#059669" opacity={opacity * 0.9} />
          <circle cx="10" cy="40" r="2" fill="#059669" opacity={opacity * 0.7} />
          <circle cx="40" cy="40" r="4" fill="#059669" opacity={opacity * 0.5} />
          <circle cx="70" cy="40" r="2" fill="#059669" opacity={opacity * 0.6} />
          <circle cx="10" cy="70" r="2.5" fill="#059669" opacity={opacity * 0.8} />
          <circle cx="40" cy="70" r="2" fill="#059669" opacity={opacity * 0.7} />
          <circle cx="70" cy="70" r="3" fill="#059669" opacity={opacity * 0.9} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#molecular)" />
    </svg>
  );
}

export function HexagonalPattern({ className = "", opacity = 0.025 }: PatternProps) {
  return (
    <svg className={className} viewBox="0 0 60 52" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="hexagonal" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="#059669" strokeWidth="0.5" opacity={opacity} />
          <path d="M30 26 L60 41 L60 63 L30 78 L0 63 L0 41 Z" fill="none" stroke="#059669" strokeWidth="0.5" opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagonal)" />
    </svg>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yRange?: number;
}

export function FloatingElement({
  children,
  className = "",
  delay = 0,
  duration = 6,
  yRange = 10,
}: FloatingElementProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -yRange, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function PulseRing({ className = "", color = "#059669" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="1" opacity="0.2" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      <circle cx="50" cy="50" r="15" fill={color} opacity="0.15" />
    </svg>
  );
}

interface BackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  opacity?: number;
}

export function BackgroundImage({ src, alt = "", className = "", opacity = 0.1 }: BackgroundImageProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover opacity-[var(--bg-opacity)]"
        style={{ '--bg-opacity': opacity } as React.CSSProperties}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white" />
    </div>
  );
}

export function PharmaBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-emerald-100/30 blur-3xl" />
      <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-teal-100/30 blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-56 h-56 rounded-full bg-cyan-100/20 blur-3xl" />
    </div>
  );
}

export default function MedicalBackgroundPatterns() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <HexagonalPattern className="absolute inset-0 w-full h-full" opacity={0.015} />
      <MolecularPattern className="absolute inset-0 w-full h-full" opacity={0.01} />
    </div>
  );
}
