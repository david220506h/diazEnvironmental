import { useState, useEffect, useRef } from "react";
import { FaPhone, FaWhatsapp, FaEnvelope, FaSms, FaEdit, FaTimes, FaCommentDots } from "react-icons/fa";
import "./FloatingContact.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";

const FloatingContact = () => {
  const language = useStore(languageStore);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleMenu = (e) => { e.stopPropagation(); setIsOpen(!isOpen); };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (contactRef.current && !contactRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const contactInfo = {
    phone: "+16028128609",
    whatsapp: "16028128609",
    email: "septic@diazenviroaz.com",
  };

  return (
    <div className={`floating-contact ${isOpen ? "open" : ""} ${isMobile ? "mobile" : ""}`} ref={contactRef}>
      <button className="contact-toggle" onClick={toggleMenu} aria-label="Open contact options">
        {isOpen ? <FaTimes /> : <FaCommentDots />}
      </button>

      {isMobile && isOpen && <div className="mobile-overlay" onClick={() => setIsOpen(false)}></div>}

      <div className="contact-options">
        <a href={`tel:${contactInfo.phone}`} className="contact-option phone-option" aria-label="Call">
          <FaPhone />
          <span className="option-label">{language === "es" ? "Llamar" : "Call"}</span>
        </a>
        <a href={`https://wa.me/${contactInfo.whatsapp}`} className="contact-option whatsapp-option" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <FaWhatsapp />
          <span className="option-label">WhatsApp</span>
        </a>
        <a href={`mailto:${contactInfo.email}`} className="contact-option email-option" aria-label="Email">
          <FaEnvelope />
          <span className="option-label">Email</span>
        </a>
        <a href={`sms:${contactInfo.phone}`} className="contact-option sms-option" aria-label="SMS">
          <FaSms />
          <span className="option-label">SMS</span>
        </a>
        <a href="#contact" className="contact-option form-option" aria-label="Form">
          <FaEdit />
          <span className="option-label">{language === "es" ? "Formulario" : "Form"}</span>
        </a>
      </div>

      <div className="contact-tooltip">
        {language === "es" ? "¿Cómo podemos ayudarte?" : "How can we help you?"}
      </div>
    </div>
  );
};

export default FloatingContact;