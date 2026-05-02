"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * useScrollReveal — observes elements with .reveal-stamp and adds .visible
 * when they enter the viewport.
 */
export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const init = useCallback(() => {
    if (observerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const els = document.querySelectorAll(".reveal-stamp");
    els.forEach((el) => observerRef.current!.observe(el));
  }, []);

  useEffect(() => {
    init();
    return () => observerRef.current?.disconnect();
  }, [init]);
}
