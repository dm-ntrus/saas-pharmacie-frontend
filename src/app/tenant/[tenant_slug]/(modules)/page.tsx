"use client";

import { useRouter } from "next/navigation";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useEffect } from "react";

export default function TenantHomePage() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  useEffect(() => {
    router.replace(buildPath("/dashboard"));
  }, [router, buildPath]);

  return null;
}
