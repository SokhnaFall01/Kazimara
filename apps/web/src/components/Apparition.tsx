"use client";

import { useEffect, useRef, useState } from "react";

/** Fait apparaître son contenu en douceur quand il entre à l'écran. */
export function Apparition({ children, delai = 0, className = "" }: { children: React.ReactNode; delai?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`kz-apparition ${visible ? "kz-visible" : ""} ${className}`} style={{ transitionDelay: `${delai}ms` }}>
      {children}
    </div>
  );
}
