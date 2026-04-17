import Footer from "@/layouts/public/Footer";
import Header from "@/layouts/public/Header";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function PublicMarketingLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
