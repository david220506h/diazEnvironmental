import "./Footer.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const language = useStore(languageStore);

  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-section map">
          <h3 className="footer-title">{language === "es" ? "Nuestra Ubicación" : "Our Location"}</h3>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d426869.25361371646!2d-112.33736071796875!3d33.44843627099289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b122cb8c3a7ff%3A0x68b79580524a492b!2sMaricopa%20County%2C%20AZ!5e0!3m2!1sen!2sus!4v1681134567890!5m2!1sen!2sus"
              width="100%" height="200"
              style={{ border: 0, borderRadius: "4px" }}
              allowFullScreen loading="lazy"
              title="Maricopa County, AZ"
            />
          </div>
        </div>

        <div className="footer-section links">
          <h3 className="footer-title">{language === "es" ? "Enlaces Rápidos" : "Quick Links"}</h3>
          <ul className="footer-links">
            <li><a href="#hero">{language === "es" ? "Inicio" : "Home"}</a></li>
            <li><a href="#services">{language === "es" ? "Servicios" : "Services"}</a></li>
            <li><a href="#about">{language === "es" ? "Nosotros" : "About"}</a></li>
            <li><a href="#projects">{language === "es" ? "Proyectos" : "Projects"}</a></li>
            <li><a href="#contact">{language === "es" ? "Contacto" : "Contact"}</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3 className="footer-title">{language === "es" ? "Contacto" : "Contact"}</h3>
          <ul className="contact-info">
            <li>
              <FaPhone className="contact-icon" />
              <a href="tel:6028128609">(602) 812-8609</a>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <a href="mailto:septic@diazenviroaz.com">septic@diazenviroaz.com</a>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>
                {language === "es"
                  ? "Condado de Maricopa, Pinal, Pima, Yavapai, Coconino y Todas las Naciones Nativas"
                  : "Maricopa, Pinal, Pima, Yavapai & Coconino Counties + All Native Nations"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    <div className="footer-section resources">
        <h3 className="footer-title">
          {language === "es" ? "Áreas de Servicio" : "Service Areas"}
        </h3>
        <ul className="footer-links">
          <li><a href="/septic-tonopah-arizona">Tonopah, AZ</a></li>
          <li><a href="/septic-laveen-arizona">Laveen, AZ</a></li>
          <li><a href="/septic-new-river-arizona">New River, AZ</a></li>
          <li><a href="/septic-system-queen-creek">Queen Creek, AZ</a></li>
          <li><a href="/septic-pinal-county">Pinal County, AZ</a></li>
          <li><a href="/septic-yavapai-county">Yavapai County, AZ</a></li>
          <li><a href="/septic-la-paz-county">La Paz County, AZ</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Diaz Environmental, LLC. {language === "es" ? "Todos los derechos reservados." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;