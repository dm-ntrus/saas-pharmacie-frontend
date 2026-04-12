import NextLink from "next/link";
import { usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";
import { ComponentProps } from "react";

// Simple Link component that works without middleware
export const Link = NextLink;

// Simple redirect function
export function redirect(href: string) {
  if (typeof window !== "undefined") {
    window.location.href = href;
  }
}

// Simple usePathname hook
export function usePathname() {
  return useNextPathname();
}

// Simple useRouter hook
export function useRouter() {
  return useNextRouter();
}

// Simple getPathname function
export function getPathname(href: string) {
  return href;
}

