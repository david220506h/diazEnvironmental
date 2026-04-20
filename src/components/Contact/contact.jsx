import { useState, useEffect, useRef } from "react";
import "./Contact.css";
import { initEmailJS, sendContactForm } from "../../Services/emailServices";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";

const Contact = () => {
  const language = useStore(languageStore);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    address: "", address2: "", serviceType: "",
    realEstateTransaction: "", newCustomer: "", message: "", receiveTexts: "yes",
  });
  const [formStatus, setFormStatus] = useState({ submitting: false, error: null, success: false });

  useEffect(() => { initEmailJS("AO0cAoAusackQVfVJ"); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, error: null, success: false });
    try {
      await sendContactForm(formData);
      setFormStatus({ submitting: false, error: null, success: true });
      setFormData({ firstName: "", lastName: "", phone: "", email: "", address: "", address2: "", serviceType: "", realEstateTransaction: "", newCustomer: "", message: "", receiveTexts: "yes" });
      setTimeout(() => setFormStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (error) {
      setFormStatus({ submitting: false, error: error.message || (language === "es" ? "Error al enviar el mensaje" : "Error sending message"), success: false });
    }
  };

  const t = {
    en: {
      tag: "Experience The Difference",
      title: "CONTACT US TODAY",
      firstName: "First Name", lastName: "Last Name",
      phone: "Phone", email: "Email", address: "Address",
      serviceLabel: "What type of service do you need?",
      selectService: "Select a service",
      services: [
        { value: "site-soil-evaluation",  label: "Site & Soil Evaluation"              },
        { value: "percolation-testing",   label: "Percolation Testing"                 },
        { value: "seepage-pit",           label: "Seepage Pit Performance Test"        },
        { value: "septic-inspection",     label: "Septic System Inspection"            },
        { value: "septic-design",         label: "Septic System Design & Permits"      },
        { value: "septic-installation",   label: "Septic System Installation"          },
        { value: "other",                 label: "Other Services"                      },
      ],
      newCustomer: "Are you a new customer?",
      select: "Select", yes: "Yes", no: "No",
      messageLabel: "How can we help you?",
      consentText: "Do you agree to receive text messages from DiazEnvironmental sent from (602) 812-8609? Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe.",
      agreeYes: "Yes, I agree to receive text messages from DiazEnvironmental.",
      agreeNo: "No, I do not want to receive text messages.",
      privacy: "See our Privacy Policy for details on how we handle your information",
      submit: "SEND MESSAGE", submitting: "SENDING…",
      success: "Your message has been successfully sent. Thank you for contacting us.",
    },
    es: {
      tag: "Experimenta la Diferencia",
      title: "CONTÁCTANOS HOY",
      firstName: "Nombre", lastName: "Apellido",
      phone: "Teléfono", email: "Correo electrónico", address: "Dirección",
      serviceLabel: "¿Qué tipo de servicio necesitas?",
      selectService: "Selecciona un servicio",
      services: [
        { value: "site-soil-evaluation",  label: "Evaluación de Sitio y Suelo"         },
        { value: "percolation-testing",   label: "Prueba de Percolación"               },
        { value: "seepage-pit",           label: "Prueba de Pozo de Absorción"         },
        { value: "septic-inspection",     label: "Inspección de Sistema Séptico"       },
        { value: "septic-design",         label: "Diseño y Permisos de Sistema Séptico"},
        { value: "septic-installation",   label: "Instalación de Sistema Séptico"      },
        { value: "other",                 label: "Otros Servicios"                     },
      ],
      newCustomer: "¿Eres un cliente nuevo?",
      select: "Seleccionar", yes: "Sí", no: "No",
      messageLabel: "¿En qué podemos ayudarte?",
      consentText: "¿Aceptas recibir mensajes de texto de DiazEnvironmental enviados desde (602) 812-8609? Pueden aplicar tarifas. Responde STOP para cancelar.",
      agreeYes: "Sí, acepto recibir mensajes de texto de DiazEnvironmental.",
      agreeNo: "No, no deseo recibir mensajes de texto.",
      privacy: "Consulta nuestra Política de Privacidad para más detalles",
      submit: "ENVIAR MENSAJE", submitting: "ENVIANDO…",
      success: "Tu mensaje fue enviado con éxito. ¡Gracias por contactarnos!",
    },
  };

  const tx = t[language] || t.en;

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <p className="experience-text">{tx.tag}</p>
          <h2 className="contact-title">{tx.title}</h2>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{tx.firstName}</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{tx.lastName}</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{tx.phone}</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required />
            </div>
            <div className="form-group">
              <label>{tx.email}</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>{tx.address}</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder={language === "es" ? "Ingresa una dirección" : "Enter a location"} required />
          </div>

          <div className="form-group">
            <label>{tx.serviceLabel}</label>
            <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
              <option value="" disabled>{tx.selectService}</option>
              {tx.services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>{tx.newCustomer}</label>
            <select name="newCustomer" value={formData.newCustomer} onChange={handleChange} required>
              <option value="" disabled>{tx.select}</option>
              <option value="yes">{tx.yes}</option>
              <option value="no">{tx.no}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{tx.messageLabel}</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows="4" required></textarea>
          </div>

          <div className="form-group text-consent">
            <p>{tx.consentText}</p>
            <div className="radio-group">
              <div className="radio-option">
                <input type="radio" id="receiveTextsYes" name="receiveTexts" value="yes" checked={formData.receiveTexts === "yes"} onChange={handleChange} />
                <label htmlFor="receiveTextsYes">{tx.agreeYes}</label>
              </div>
              <div className="radio-option">
                <input type="radio" id="receiveTextsNo" name="receiveTexts" value="no" checked={formData.receiveTexts === "no"} onChange={handleChange} />
                <label htmlFor="receiveTextsNo">{tx.agreeNo}</label>
              </div>
            </div>
            <p className="privacy-link"><a href="#">{tx.privacy}</a></p>
          </div>

          {formStatus.error && <div className="error-message"><p>{formStatus.error}</p></div>}
          {formStatus.success && <div className="success-message"><p>{tx.success}</p></div>}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={formStatus.submitting}>
              {formStatus.submitting ? tx.submitting : tx.submit}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;