import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./CustomCursor.css";

// Elementos sobre los que el círculo se agranda
const HOVER_TARGETS = "a, button, select, label, .service-card, .project-card, [data-cursor]";

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Solo en dispositivos con mouse (no en celular/tablet)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
    const ringDuration = reduceMotion ? 0.01 : 0.5;
    const ringX = gsap.quickTo(ring, "x", { duration: ringDuration, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: ringDuration, ease: "power3" });

    let visible = false;
    const handleMove = (e) => {
      if (!visible) {
        // Primer movimiento: colocar sin animar desde (0,0)
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        document.documentElement.classList.add("cursor-visible");
        visible = true;
      }
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    };
    const handleOver = (e) => {
      const isHover = !!e.target.closest?.(HOVER_TARGETS);
      document.documentElement.classList.toggle("cursor-hover", isHover);
    };
    const handleLeave = () => {
      document.documentElement.classList.remove("cursor-visible");
      visible = false;
    };
    const handleDown = () => document.documentElement.classList.add("cursor-down");
    const handleUp = () => document.documentElement.classList.remove("cursor-down");

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.classList.remove("cursor-visible", "cursor-hover", "cursor-down");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
