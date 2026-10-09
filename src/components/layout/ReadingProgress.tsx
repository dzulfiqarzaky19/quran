"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${fraction})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="h-0.5 w-full bg-secondary-container" aria-hidden>
      <div ref={fillRef} className="h-full origin-left scale-x-0 bg-primary" />
    </div>
  );
}
