import { useState, useEffect } from "react";
import { languageStore } from "../../stores/language";
import "./LanguageModal.css";

const LanguageModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const selected = localStorage.getItem("language");
    if (!selected) setShow(true);
  }, []);

  const selectLanguage = (lang) => {
    languageStore.set(lang);
    localStorage.setItem("language", lang);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="lang-overlay">
      <div className="lang-modal">
        <h2 className="lang-title">Select a Language</h2>
        <p className="lang-subtitle">Selecciona un idioma</p>
        <div className="lang-buttons">
          <button className="lang-btn" onClick={() => selectLanguage("en")}>
            <img src="https://flagcdn.com/w80/us.png" alt="English" className="modal-flag" />
            English
          </button>
          <button className="lang-btn" onClick={() => selectLanguage("es")}>
            <img src="https://flagcdn.com/w80/mx.png" alt="Español" className="modal-flag" />
            Español
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;