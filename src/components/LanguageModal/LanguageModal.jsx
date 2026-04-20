import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
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
            <span className="lang-flag">🇺🇸</span>
            English
          </button>
          <button className="lang-btn" onClick={() => selectLanguage("es")}>
            <span className="lang-flag">🇲🇽</span>
            Español
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;