import "./Hero.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import hero2 from "../../assets/hero2.jpeg";

const Hero = () => {
  const language = useStore(languageStore);

  return (
    <div className="Hero" id="hero">
      <div className="Hero-superior">
        <div className="Text-hero">
          <h1 className="Texto-principal">
            {language === "es" ? (
              <>
                <span style={{ fontWeight: 300 }}>Servicios profesionales de limpieza </span>
                <span style={{ fontWeight: 900 }}>en Phoenix, Arizona.</span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 300 }}>Professional Cleaning Services </span>
                <span style={{ fontWeight: 800 }}>in Phoenix, Arizona.</span>
              </>
            )}
          </h1>

          <p className="Informacion-principal">
            {language === "es"
              ? "Experiencia en limpieza industrial, comercial y residencial."
              : "Experience in industrial, commercial, and residential cleaning."}
          </p>

          <div className="Hero-btns">
            <a href="#contact" className="btn-primary">
              {language === "es" ? "Solicitar servicio" : "Request a service"}
            </a>
            <a href="#services" className="btn-secondary">
              {language === "es" ? "Ver servicios" : "View services"}
            </a>
          </div>
        </div>

        <div className="Hero-image">
          <img src={hero2.src} alt="Diaz Cleaning – Limpieza profesional Phoenix AZ" />
        </div>
      </div>
    </div>
  );
};

export default Hero;