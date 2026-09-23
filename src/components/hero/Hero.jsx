import "./Hero.css";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { gsap } from "gsap";
import { FaArrowRight } from "react-icons/fa";
import { languageStore } from "../../stores/language";
import useMagnetic from "../../hooks/useMagnetic";

const SLIDE_DURATION = 15000; // ms por foto/video

const media = [
  { type: "image", src: "/assets/images/Escavadora.jpg" },
  { type: "video", src: "/assets/Videos/video1.mp4" },
  { type: "video", src: "/assets/Videos/video2.mp4" },
];

// Curvas de nivel (textura de fondo): anillos irregulares concéntricos, calculados una sola vez
const contourPaths = Array.from({ length: 12 }, (_, k) => {
  const r = 60 + k * 48;
  const points = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const wobble = 1 + 0.08 * Math.sin(a * 3 + k * 0.7) + 0.05 * Math.sin(a * 5 - k * 0.4);
    return `${(r * wobble * Math.cos(a)).toFixed(1)},${(r * 0.72 * wobble * Math.sin(a)).toFixed(1)}`;
  });
  return `M${points.join("L")}Z`;
});

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const Hero = () => {
  const language = useStore(languageStore);
  const [activeVideo, setActiveVideo] = useState(0);
  const [inView, setInView] = useState(true);
  const videoRefs = useRef([]); // Referencias para controlar los videos manualmente
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const ctaRef = useMagnetic({ strength: 0.2 });

  // ⏱️ Cambio automático cada 15 segundos (se reinicia al elegir uno manualmente)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveVideo((prev) => (prev + 1) % media.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timeout);
  }, [activeVideo]);

  // Pausar videos cuando el Hero sale de pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 🔥 Control de reproducción + carga diferida: solo el video activo y el siguiente se descargan
  useEffect(() => {
    media.forEach((item, index) => {
      if (item.type !== "video") return;
      const videoEl = videoRefs.current[index];
      if (!videoEl) return;
      if (index === activeVideo && inView) {
        videoEl.preload = "auto";
        videoEl.play().catch((err) => console.log("Auto-play blocked:", err));
      } else {
        videoEl.pause(); // Pausa los videos que no están activos para ahorrar recursos
      }
    });
    const next = videoRefs.current[(activeVideo + 1) % media.length];
    if (next && next.preload === "none") next.preload = "auto";
  }, [activeVideo, inView]);

  // Al cambiar de slide, el video entrante empieza desde el inicio
  useEffect(() => {
    const videoEl = videoRefs.current[activeVideo];
    if (videoEl) videoEl.currentTime = 0;
  }, [activeVideo]);

  // Animación de entrada escalonada (título → subtítulo → botón, luego la tarjeta)
  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const items = root.querySelectorAll("[data-hero-reveal]");
      if (reduceMotion) {
        gsap.set([items, cardRef.current], { opacity: 1, y: 0, x: 0, scale: 1 });
        return;
      }
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(items, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 })
        .fromTo(cardRef.current, { opacity: 0, x: 60, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 1.1 }, 0.25);
    }, root);
    document.documentElement.classList.remove("hero-anim");
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      <div className="hero-panel">
        <svg className="hero-contours" viewBox="-640 -460 1280 920" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {contourPaths.map((d, i) => <path key={i} d={d} />)}
        </svg>

        <div className="hero-content">
          <h1 className="hero-title" data-hero-reveal>
            {language === "es"
              ? "Soluciones de calidad para tu proyecto"
              : "Quality solutions for your project"}
          </h1>
          <p className="hero-subtitle" data-hero-reveal>
            {language === "es"
              ? "Diaz Environmental brinda servicios expertos en sistemas sépticos, pruebas de suelo y evaluaciones ambientales en Arizona. ¡Contáctanos!"
              : "Diaz Environmental delivers expert septic system design, soil testing and environmental services across Arizona. Contact us today!"}
          </p>
          <div id="hero-button-work" className="hero-buttons" data-hero-reveal>
            <a href="#contact" className="btn btn-primary" ref={ctaRef}>
              {language === "es" ? "Trabaja con nosotros" : "Work with us"}
              <FaArrowRight className="btn-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <a href="#services" className="scroll-down">
          <span className="mouse"><span className="wheel"></span></span>
          <span className="scroll-text">{language === "es" ? "Ver más" : "See More"}</span>
        </a>
      </div>

      <div className="hero-media">
        <div className="hero-card" ref={cardRef}>
          {media.map((item, index) => (
            item.type === "image" ? (
              <img
                key={index}
                src={item.src}
                alt="Servicio de excavación"
                className={"hero-slide" + (activeVideo === index ? " is-active" : "")}
                fetchPriority="high"
              />
            ) : (
              <video
                key={index}
                ref={(el) => (videoRefs.current[index] = el)}
                className={"hero-slide" + (activeVideo === index ? " is-active" : "")}
                muted
                loop
                playsInline
                preload="none"
                src={item.src}
              />
            )
          ))}

          <div className="hero-progress">
            {media.map((item, index) => (
              <button
                key={index}
                type="button"
                className={
                  "hero-progress-bar" +
                  (index === activeVideo ? " is-active" : "") +
                  (index < activeVideo ? " is-done" : "")
                }
                onClick={() => setActiveVideo(index)}
                aria-label={`${index + 1} / ${media.length}`}
              >
                <span style={{ animationDuration: `${SLIDE_DURATION}ms` }} />
              </button>
            ))}
          </div>

          <div className="hero-testimonial">
            <div className="testimonial-stars" aria-label="5/5">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="testimonial-text">
              {language === "es"
                ? "Profesionales de confianza con los mejores sistemas sépticos en Arizona."
                : "Trusted professionals delivering the best septic system solutions across Arizona."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
