import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// Altura del navbar fijo (body tiene margin-top: 80px en Layout.astro)
const NAV_OFFSET = -80;

// Contenedores con scroll propio que Lenis no debe interceptar
const SCROLLABLE_OVERLAYS = ["service-modal-overlay", "lang-overlay"];

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      prevent: (node) => SCROLLABLE_OVERLAYS.some((c) => node.classList.contains(c)),
    });
    window.__lenis = lenis;

    // Sincronizar Lenis con el ticker de GSAP para que ScrollTrigger lea la misma posición
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Si un modal acaba de cerrarse, Lenis sigue detenido unos instantes: esperar a que se reanude
    const scrollToTarget = (target, framesLeft = 30) => {
      if (lenis.isStopped && framesLeft > 0) {
        requestAnimationFrame(() => scrollToTarget(target, framesLeft - 1));
        return;
      }
      lenis.scrollTo(target, { offset: NAV_OFFSET, force: true });
    };

    // Anclas internas (#services, #contact...) con scroll suave y compensando el navbar.
    // En fase de captura: los onClick de React con stopPropagation (p. ej. el modal de servicios)
    // cortan el evento antes de que llegue a document.
    const handleAnchorClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (hash === "#") return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", handleAnchorClick, true);

    // Pausar Lenis cuando un modal bloquea el scroll del body (body.style.overflow = "hidden")
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleAnchorClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
};

export default SmoothScroll;
