"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * useScrollReveal — observes elements with .reveal-stamp and adds .visible
 * when they enter the viewport.
 */
export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const init = useCallback(() => {
    observerRef.current?.disconnect();

    const els = document.querySelectorAll(".reveal-stamp");

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

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

    els.forEach((el) => observerRef.current!.observe(el));
  }, []);

  useEffect(() => {
    init();
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [init]);
}
