import "./Footer.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const language = useStore(languageStore);

  const t = language === "es" ? {
    location: "Nuestra Ubicación",
    links: "Enlaces Rápidos",
    contact: "Contacto",
    home: "Inicio", services: "Servicios",
    about: "Nosotros", projects: "Proyectos",
    contactLink: "Contacto",
    address: "Phoenix, Glendale, Maricopa.",
    copy: "© 2026 Diaz Cleaning LLC Service. Todos los derechos reservados.",
    privacy: "Aviso de privacidad",
    terms: "Términos y condiciones",
  } : {
    location: "Our Location",
    links: "Quick Links",
    contact: "Contact",
    home: "Home", services: "Services",
    about: "About", projects: "Projects",
    contactLink: "Contact",
    address: "Phoenix, Arizona.",
    copy: "© 2026 Diaz Cleaning LLC Service. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section map">
          <h3 className="footer-title">{t.location}</h3>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps?q=33.4484,-112.0740&z=10&output=embed"
              width="100%" height="450" style={{ border: 0 }}
              allowFullScreen loading="lazy"
              title="Diaz Cleaning LLC ubicación en Phoenix Arizona"
            />
          </div>
        </div>

        <div className="footer-section links">
          <h3 className="footer-title">{t.links}</h3>
          <ul className="footer-links">
            <li><a href="#hero">{t.home}</a></li>
            <li><a href="#services">{t.services}</a></li>
            <li><a href="#about">{t.about}</a></li>
            <li><a href="#projects">{t.projects}</a></li>
            <li><a href="#contact">{t.contactLink}</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3 className="footer-title">{t.contact}</h3>
          <ul className="contact-info">
            <li>
              <FaPhone className="footer-icon" />
              <a href="tel:+14804794507">(480) 479-4507</a>
            </li>
            <li>
              <FaEnvelope className="footer-icon" />
              <a href="mailto:diazcleaning.az@gmail.com">diazcleaning.az@gmail.com</a>
            </li>
            <li>
              <FaMapMarkerAlt className="footer-icon" />
              <span>{t.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t.copy} | <a href="#">{t.privacy}</a> | <a href="#">{t.terms}</a></p>
      </div>
    </footer>
  );
};

export default Footer;