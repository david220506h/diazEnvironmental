import "./AboutUs.css";
import { useStore } from "@nanostores/react";
import { useRef } from "react";
import { languageStore } from "../../stores/language";
import useMagnetic from "../../hooks/useMagnetic";
import useScrollReveal from "../../hooks/useScrollReveal";

const AboutUs = () => {
  const language = useStore(languageStore);
  const sectionRef = useRef(null);
  const scheduleRef = useMagnetic({ strength: 0.15, radius: 24 }); // suave: "or" está a 32px del botón
  useScrollReveal(sectionRef);

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="about-header">
        <h1 data-reveal>{language === "es" ? "¡Bienvenido a DiazEnvironmental!" : "Welcome To DiazEnvironmental!"}</h1>
        <p className="intro-text" data-reveal>
          {language === "es"
            ? "Somos especialistas en servicios ambientales con enfoque en trabajo en equipo, ética y excelencia. Nuestras certificaciones y licencias especializadas nos posicionan de manera única en el campo ambiental y de gestión de residuos."
            : "We're specialists in environmental services with a focus on teamwork, ethics, and excellence. Our extensive certifications and specialized licenses position us uniquely in the environmental and waste management field."}
        </p>
        <blockquote className="quote" data-reveal>
          <p>"Every man must decide whether he will walk in the light of creative altruism or in the darkness of destructive selfishness."</p>
          <cite>- Martin Luther King Jr</cite>
        </blockquote>
      </div>

      <div className="highlight-section" data-reveal>
        <h2>{language === "es" ? "¡Pruebas de percolación y diseños sépticos rápidos y precisos!" : "Fast & Accurate Percolation Tests & Septic Designs!"}</h2>
        <p>
          {language === "es"
            ? "En promedio tardamos de 3 a 5 días hábiles para todo: desde las pruebas de suelo hasta el diseño y presentación al municipio. Contamos con nuestra propia excavadora y equipo de perforación con mantenimiento regular."
            : "We average 3-5 business days for everything from soil testing, to designing and submission to the permitting jurisdiction. We fully own our own excavator and drilling equipment with regular maintenance schedules."}
        </p>
        <p>
          <strong>Hablo Español!</strong> Les ofrezco la confianza de 3.5 años con el condado de Maricopa para la inspección, diseño y todo el proceso para construir un nuevo sistema séptico. ¡Resultados más rápidos, precisos y consultas sin estrés!
        </p>
      </div>

      <div className="cta-section" data-reveal>
        <h2>{language === "es" ? "¿Listo para programar tu inspección?" : "Ready to schedule your inspection?"}</h2>
        <div className="cta-buttons">
          <a href="#contact" className="primary-btn" ref={scheduleRef}>
            {language === "es" ? "Agendar ahora" : "Schedule Now"}
          </a>
          <p className="or-text">{language === "es" ? "o" : "or"}</p>
          <div className="call-us">
            <p>{language === "es" ? "¡Llámanos hoy!" : "Call Us Today!"}</p>
            <a href="tel:6028128609" className="phone-number">(602) 812-8609</a>
          </div>
        </div>
        <p className="contact-note">
          {language === "es"
            ? "Un miembro de nuestro equipo te contactará pronto para confirmar tu información."
            : "A member of our team will contact you shortly to confirm your contact information."}
        </p>
      </div>
    </section>
  );
};

export default AboutUs;