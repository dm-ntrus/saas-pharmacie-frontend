import type { ReactNode } from "react";

// Disable static generation for all auth pages
export const dynamic = "force-dynamic";
export const dynamicParams = true;

type LayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: LayoutProps) {
  return children;
}
