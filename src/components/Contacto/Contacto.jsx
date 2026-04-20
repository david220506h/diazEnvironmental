import "./Contacto.css";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import emailjs from "emailjs-com";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";

const translations = {
  es: {
    formTitle: "Envíanos un mensaje",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Email",
    emailPlaceholder: "tu@email.com",
    phone: "Teléfono",
    phonePlaceholder: "Tel.",
    message: "Mensaje",
    messagePlaceholder: "¿En qué podemos ayudarte?",
    sendBtn: "Enviar mensaje",
    successMsg: "¡Mensaje enviado con éxito!",
    contactTitle: "Contacto",
    address: "9838 N 44th drive Glendale Arizona 85302",
    scheduleTitle: "Horario de atención",
    weekdays: "Lunes a Viernes:",
    saturday: "Sábado:",
    sunday: "Domingo:",
    weekdaysHours: "8:00 - 18:00",
    saturdayHours: "9:00 - 14:00",
    sundayHours: "Cerrado"
  },

  en: {
    formTitle: "Send us a message",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    phone: "Phone",
    phonePlaceholder: "Phone",
    message: "Message",
    messagePlaceholder: "How can we help you?",
    sendBtn: "Send message",
    successMsg: "Message sent successfully!",
    contactTitle: "Contact",
    address: "9838 N 44th drive Glendale Arizona 85302",
    scheduleTitle: "Working hours",
    weekdays: "Monday to Friday:",
    saturday: "Saturday:",
    sunday: "Sunday:",
    weekdaysHours: "8:00 - 18:00",
    saturdayHours: "9:00 - 14:00",
    sundayHours: "Closed"
  }
};

const Contacto = () => {
  const language = useStore(languageStore);
  const [sent, setSent] = useState(false);
  const t = translations[language] || translations.es;

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_5r4smv7",     
      "template_gcec9vb",     
      e.target,
      "yxGac-y7e2FYECmn2"    
    ).then(() => {
      setSent(true);
      e.target.reset();
      setTimeout(() => setSent(false), 4000);
    }).catch(err => console.error("Error al enviar:", err));
  };

  return (
    <div className="Contacto" id="contact">
      <div className="Contacto-container">
        <div className="Contacto-grid">

          {/* FORM */}
          <div className="contacto-form-card">
            <h2 className="contacto-titulo">{t.formTitle}</h2>
            <form className="contacto-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.name}</label>
                  <input type="text" name="name" placeholder={t.namePlaceholder} required />
                </div>
                <div className="form-group">
                  <label>{t.email}</label>
                  <input type="email" name="email" placeholder={t.emailPlaceholder} required />
                </div>
              </div>
              <div className="form-group">
                <label>{t.phone}</label>
                <input type="tel" name="phone" placeholder={t.phonePlaceholder} />
              </div>
              <div className="form-group">
                <label>{t.message}</label>
                <textarea name="message" placeholder={t.messagePlaceholder}></textarea>
              </div>
              <button type="submit" className="contacto-btn">{t.sendBtn}</button>
              {sent && <p className="mensaje-exito">{t.successMsg}</p>}
            </form>
          </div>

          {/* INFO + SCHEDULE */}
          <div className="Contacto-side">
            <div className="Contacto-info">
              <h3>{t.contactTitle}</h3>
              <p><FaMapMarkerAlt className="info-icon" />{t.address}</p>
              <p><FaPhone className="info-icon" />(480) 479-4507</p>
              <p><FaEnvelope className="info-icon" />diazcleaning.az@gmail.com</p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
                <a href="#" className="social-link" aria-label="WhatsApp"><FaWhatsapp /></a>
              </div>
            </div>

            <div className="Contacto-horario">
              <h3>{t.scheduleTitle}</h3>
              <div className="horario-item">
                <span>{t.weekdays}</span>
                <span>{t.weekdaysHours}</span>
              </div>
              <div className="horario-item">
                <span>{t.saturday}</span>
                <span>{t.saturdayHours}</span>
              </div>
              <div className="horario-item closed">
                <span>{t.sunday}</span>
                <span>{t.sundayHours}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contacto;