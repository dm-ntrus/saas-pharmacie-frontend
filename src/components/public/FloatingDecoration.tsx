"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const FLOATING_IMAGES = [
  { src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop", alt: "Médicaments" },
  { src: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop", alt: "Vaccins" },
  { src: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop", alt: "Ordonnances" },
  { src: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=300&fit=crop", alt: "Laboratoire" },
  { src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300&h=300&fit=crop", alt: "Pharmacie" },
  { src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&h=300&fit=crop", alt: "Santé" },
];

const POSITIONS = [
  { left: "1.5rem", top: "18%" },
  { right: "1.5rem", top: "25%" },
  { left: "1rem", top: "50%" },
  { right: "1rem", top: "55%" },
  { left: "1.5rem", top: "72%" },
  { right: "1.5rem", top: "68%" },
];

const MOBILE_POSITIONS = [
  { left: "0.5rem", top: "12%" },
  { right: "0.5rem", top: "18%" },
  { left: "0.5rem", top: "40%" },
  { right: "0.5rem", top: "45%" },
  { left: "0.5rem", top: "68%" },
  { right: "0.5rem", top: "72%" },
];

export function FloatingDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
      {FLOATING_IMAGES.map((img, index) => {
        const pos = POSITIONS[index];
        return (
          <motion.div
            key={img.alt}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0, 10, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: index * 0.15 },
              scale: { duration: 0.5, delay: index * 0.15 },
              y: { duration: 5 + index * 0.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
            }}
            className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-24 lg:h-24 xl:w-28 xl:h-28"
            style={pos}
          >
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-white/40 bg-white/25 backdrop-blur-sm">
              <Image src={img.src} alt={img.alt} fill sizes="112px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function FloatingDecorationMobile() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none sm:hidden">
      {FLOATING_IMAGES.map((img, index) => {
        const pos = MOBILE_POSITIONS[index];
        return (
          <motion.div
            key={img.alt}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0, 8, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: index * 0.1 },
              scale: { duration: 0.4, delay: index * 0.1 },
              y: { duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 },
            }}
            className="absolute w-14 h-14 sm:w-16 sm:h-16"
            style={pos}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-white/40 bg-white/30 backdrop-blur-sm">
              <Image src={img.src} alt={img.alt} fill sizes="56px" className="object-cover" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
