import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Inclinación 3D leve que sigue al puntero (mouse) o al dedo (touch).
 * Usa gsap.quickTo (ticker de GSAP = requestAnimationFrame) sobre rotationX/rotationY,
 * así convive con otras animaciones GSAP del mismo elemento (p. ej. reveals con "y")
 * sin re-renders de React. Desactivado con prefers-reduced-motion.
 *
 * @param {object} options
 * @param {number} options.max          Grados máximos de inclinación
 * @param {number} options.scale        Escala mientras está activo (sensación de "levantar")
 * @param {number} options.perspective  Perspectiva en px
 * @returns ref para asignar al elemento
 */
const useTilt = ({ max = 6, scale = 1.02, perspective = 900 } = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { transformPerspective: perspective, transformStyle: "preserve-3d" });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const scaleTo = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" });

    let rect = null;

    const tiltTo = (clientX, clientY) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width - 0.5;  // -0.5 … 0.5
      const py = (clientY - rect.top) / rect.height - 0.5;
      rotY(px * max * 2);
      rotX(-py * max * 2);
      scaleTo(scale);
    };

    const reset = () => {
      rect = null;
      rotX(0);
      rotY(0);
      scaleTo(1);
    };

    const handleEnter = () => { rect = el.getBoundingClientRect(); };
    const handleMove = (e) => tiltTo(e.clientX, e.clientY);
    // Touch: reacciona al tocar; si el gesto se convierte en scroll llega pointercancel y se resetea
    const handleDown = (e) => {
      if (e.pointerType === "mouse") return;
      rect = el.getBoundingClientRect();
      tiltTo(e.clientX, e.clientY);
    };
    const handleUp = (e) => { if (e.pointerType !== "mouse") reset(); };
    // Al hacer scroll el elemento se mueve bajo el puntero: invalidar la posición cacheada
    const handleScroll = () => { rect = null; };

    el.addEventListener("pointerenter", handleEnter);
    el.addEventListener("pointermove", handleMove, { passive: true });
    el.addEventListener("pointerdown", handleDown, { passive: true });
    el.addEventListener("pointerup", handleUp);
    el.addEventListener("pointercancel", reset);
    el.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("pointerenter", handleEnter);
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerdown", handleDown);
      el.removeEventListener("pointerup", handleUp);
      el.removeEventListener("pointercancel", reset);
      el.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", handleScroll);
      gsap.set(el, { rotationX: 0, rotationY: 0, scale: 1 });
    };
  }, [max, scale, perspective]);

  return ref;
};

export default useTilt;
