import Image from "next/image";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full flex relative overflow-hidden">

<div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 to-slate-900/95 z-10"></div>
        <Image
          src="/images/tenant.jpg"
          alt="Pharmacy"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />

      {/* Foreground Content */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
 