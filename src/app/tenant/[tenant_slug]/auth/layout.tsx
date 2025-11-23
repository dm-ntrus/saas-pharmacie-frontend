import Image from "next/image";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full flex relative overflow-hidden">

      {/* Background Layer */}
      <div className="absolute inset-0 -z-10">
        {/* Background Image */}
        <Image
          src="/images/tenant.jpg"
          alt="Pharmacy background"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />

        {/* Main dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/50 via-sky-900/90 to-cyan-900/70" />

        {/* Animated subtle lighting */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-transparent to-cyan-500/10 animate-pulse" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
 