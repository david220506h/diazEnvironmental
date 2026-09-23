import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Efecto "magnético": el elemento se desplaza levemente hacia el cursor
 * cuando éste se acerca. Solo con mouse y sin prefers-reduced-motion.
 *
 * @param {object} options
 * @param {number} options.strength  Fracción de la distancia al cursor que se mueve (0–1)
 * @param {number} options.radius    Margen en px alrededor del elemento que activa el efecto
 * @returns ref para asignar al elemento
 */
const useMagnetic = ({ strength = 0.3, radius = 40 } = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    let attracted = false;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      // Centro sin el desplazamiento actual, para no retroalimentar el movimiento
      const cx = rect.left + rect.width / 2 - gsap.getProperty(el, "x");
      const cy = rect.top + rect.height / 2 - gsap.getProperty(el, "y");
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const inside =
        Math.abs(dx) < rect.width / 2 + radius && Math.abs(dy) < rect.height / 2 + radius;

      if (inside) {
        attracted = true;
        gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      } else if (attracted) {
        attracted = false;
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, radius]);

  return ref;
};

export default useMagnetic;
