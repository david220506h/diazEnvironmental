import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal (fade + slide up) con ScrollTrigger para todos los elementos [data-reveal]
 * dentro de scopeRef. Los que entran en pantalla a la vez aparecen escalonados
 * en orden de documento (ScrollTrigger.batch), p. ej. una fila de tarjetas del grid.
 * Con prefers-reduced-motion no se anima nada.
 *
 * @param {React.RefObject<HTMLElement>} scopeRef
 * @param {object} options
 * @param {number} options.y         Desplazamiento inicial en px
 * @param {number} options.duration  Duración de cada elemento
 * @param {number} options.stagger   Retraso entre elementos del mismo lote
 * @param {string} options.start     Posición de disparo de ScrollTrigger
 */
const useScrollReveal = (scopeRef, { y = 40, duration = 0.8, stagger = 0.1, start = "top 88%" } = {}) => {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray("[data-reveal]", scope);
      if (!items.length) return;

      // Los que ya quedaron por encima de la pantalla (p. ej. al entrar por un #ancla) se muestran sin animar
      const pending = items.filter((el) => el.getBoundingClientRect().bottom > 0);
      gsap.set(pending, { opacity: 0, y });

      const reveal = (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration, stagger, ease: "power3.out", overwrite: "auto" });

      ScrollTrigger.batch(pending, { start, once: true, onEnter: reveal });
    }, scope);

    return () => ctx.revert();
  }, [scopeRef, y, duration, stagger, start]);
};

export default useScrollReveal;
