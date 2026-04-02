"use client";

import { useCallback, useRef } from "react";

export function usePrint() {
  const printRef = useRef<HTMLDivElement>(null);

  const triggerPrint = useCallback(() => {
    window.print();
  }, []);

  return { printRef, triggerPrint };
}
