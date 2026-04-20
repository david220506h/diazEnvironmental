import "./Hero.css";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";

const Hero = () => {
  const language = useStore(languageStore);
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef([]); // Referencias para controlar los videos manualmente

  // Configuración de los medios (Asegúrate de que las extensiones sean correctas)
  const media = [
    { type: "image", src: "/assets/images/Escavadora.jpg" }, 
    { type: "video", src: "/assets/Videos/video1.mp4" },
    { type: "video", src: "/assets/Videos/video2.mp4" }
  ];

  // ⏱️ Cambio automático cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % media.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [media.length]);

  // 🔥 Control de reproducción manual para evitar bloqueos del navegador
  useEffect(() => {
    media.forEach((item, index) => {
      if (item.type === "video") {
        const videoEl = videoRefs.current[index];
        if (videoEl) {
          if (index === activeVideo) {
            videoEl.currentTime = 0; // Reinicia para que se vea desde el inicio
            videoEl.play().catch((err) => console.log("Auto-play blocked:", err));
          } else {
            videoEl.pause(); // Pausa los videos que no están activos para ahorrar recursos
          }
        }
      }
    });
  }, [activeVideo, media]);

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          {language === "es"
            ? "Soluciones de calidad para tu proyecto"
            : "Quality solutions for your project"}
        </h1>
        <div className="content-subtitle">
          <p className="hero-subtitle">
            {language === "es"
              ? "Diaz Environmental brinda servicios expertos en sistemas sépticos, pruebas de suelo y evaluaciones ambientales en Arizona. ¡Contáctanos!"
              : "Diaz Environmental delivers expert septic system design, soil testing and environmental services across Arizona. Contact us today!"}
          </p>
        </div>
      </div>

      <div className="hero-image-section">
        <div className="hero-image-container">
          {media.map((item, index) => (
            item.type === "image" ? (
              <img
                key={index}
                src={item.src}
                alt="Servicio de excavación"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: activeVideo === index ? 1 : 0,
                  transition: "opacity 0.8s ease-in-out",
                  zIndex: activeVideo === index ? 1 : 0
                }}
              />
            ) : (
              <video
                key={index}
                ref={(el) => (videoRefs.current[index] = el)}
                muted
                loop
                playsInline
                preload="auto"
                src={item.src}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "#000",
                  opacity: activeVideo === index ? 1 : 0,
                  transition: "opacity 0.8s ease-in-out",
                  zIndex: activeVideo === index ? 1 : 0
                }}
              />
            )
          ))}
        </div>

        <div className="hero-testimonial">
          <div className="testimonial-stars">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <p className="testimonial-text">
            {language === "es"
              ? "Profesionales de confianza con los mejores sistemas sépticos en Arizona."
              : "Trusted professionals delivering the best septic system solutions across Arizona."}
          </p>
        </div>
      </div>

      <div id="hero-button-work" className="hero-buttons">
        <a href="#contact" className="btn btn-primary">
          {language === "es" ? "Trabaja con nosotros" : "Work with us"}
        </a>
      </div>

      <div className="scroll-down">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <span className="scroll-text">{language === "es" ? "Ver más" : "See More"}</span>
      </div>
    </section>
  );
};

export default Hero;