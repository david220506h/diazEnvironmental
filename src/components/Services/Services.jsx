import { useRef, useEffect, useState, useCallback } from "react";
import { FaTools, FaHome, FaWrench, FaWater, FaToilet, FaToolbox, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Services.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import useTilt from "../../hooks/useTilt";
import useMagnetic from "../../hooks/useMagnetic";
import useScrollReveal from "../../hooks/useScrollReveal";

import SepticSystem        from "../../assets/images/services/pruebaDePercolasion.jpeg";
import SepticSystem2        from "../../assets/images/services/pruebaDePercolasion2.jpeg";
import SoilExamination     from "../../assets/images/services/examenDeTierra.jpeg";
import ConstructionPermits from "../../assets/images/services/installation.jpeg";
import ConstructionPermits2 from "../../assets/images/services/installation2.png";
import ConstructionPermits3 from "../../assets/images/services/installation3.png";
import pseticInstallation  from "../../assets/images/services/permisos.jpeg";
import pseticInstallation2  from "../../assets/images/services/permisos2.jpeg";
import rendimiento    from "../../assets/images/services/rendimiento.jpeg";
import rendimiento2       from "../../assets/images/services/rendimiento2.jpeg";

const Icon = ({ icon: IconComponent }) => IconComponent ? <IconComponent /> : null;

const ServiceCard = ({ icon, title, shortDescription, image, onClick }) => {
  const tiltRef = useTilt();
  const infoRef = useMagnetic({ strength: 0.3, radius: 20 });

  return (
    <div
      className="service-card"
      ref={tiltRef}
      onClick={onClick}
      data-reveal
    >
      <div className="service-image">
        <img src={image} alt={title} />
        <div className="service-icon"><Icon icon={icon} /></div>
      </div>
      <div className="service-content">
        <h3 className="service-title">{title}</h3>
        <p className="service-description">{shortDescription}</p>
        <div className="service-read-more">
          <span ref={infoRef}>+ Info</span>
        </div>
      </div>
    </div>
  );
};

const MODAL_EXIT_MS = 250; // igual que la animación de salida en Services.css

const ServiceModal = ({ service, onClose, requestLabel }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const ctaRef = useMagnetic({ strength: 0.25 });
  const images = service.images || [service.image];

  // Cierre con fade: se desmonta al terminar la animación de salida
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setTimeout(onClose, MODAL_EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    setCurrentImg(0);
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") requestClose();
      if (e.key === "ArrowLeft") setCurrentImg(i => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setCurrentImg(i => (i + 1) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [requestClose, images.length]);

  const prev = () => setCurrentImg(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrentImg(i => (i + 1) % images.length);

  return (
    <div className={`service-modal-overlay${closing ? " is-closing" : ""}`} onClick={requestClose}>
      <div className="service-modal" onClick={e => e.stopPropagation()}>
        <button className="service-modal-close" onClick={requestClose}>
          <FaTimes />
        </button>

        {/* Galería de imágenes */}
        <div className="service-modal-gallery">
          <img src={images[currentImg]} alt={service.title} className="service-modal-main-img" />
          <div className="service-modal-icon"><Icon icon={service.icon} /></div>

          {images.length > 1 && (
            <>
              <button className="modal-arrow modal-arrow-left" onClick={e => { e.stopPropagation(); prev(); }}>
                <FaChevronLeft />
              </button>
              <button className="modal-arrow modal-arrow-right" onClick={e => { e.stopPropagation(); next(); }}>
                <FaChevronRight />
              </button>
              <div className="modal-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`modal-dot ${i === currentImg ? "active" : ""}`}
                    onClick={e => { e.stopPropagation(); setCurrentImg(i); }}
                  />
                ))}
              </div>
              {/* Thumbnails */}
              <div className="modal-thumbnails">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${service.title} ${i + 1}`}
                    className={`modal-thumb ${i === currentImg ? "active" : ""}`}
                    onClick={e => { e.stopPropagation(); setCurrentImg(i); }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="service-modal-body">
          <h3 className="service-modal-title">{service.title}</h3>
          <p className="service-modal-description">{service.fullDescription}</p>
          {/* Cierre inmediato (sin fade): Lenis debe estar activo para hacer scroll a #contact */}
          <a href="#contact" className="service-modal-cta" onClick={onClose} ref={ctaRef}>
            {requestLabel}
          </a>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const language = useStore(languageStore);
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);
  const [selectedService, setSelectedService] = useState(null);

  const services = {
    en: [
      {
        title: "Site & Soil Evaluations",
        shortDescription: "Test before you build! Evaluating soil conditions for new and existing residences.",
        fullDescription: "Test before you build! This evaluation is used for on-site wastewater treatment systems and for Phase I of new development — evaluating soil horizon, surface and subsurface conditions, and best treatment methods for new and existing residences.",
        image: SoilExamination.src,
        images: [SoilExamination.src], // ← agrega más imágenes aquí: [img1.src, img2.src, img3.src]
      },
      {
        title: "Site-specific Soil Percolation Testing",
        shortDescription: "Specialized tests to specify treatment requirements for your new septic system.",
        fullDescription: "When limiting conditions exist, we include another type of test that will better specify treatment requirements for your new septic system. Although not required for every single development, this test is usually required for extremely rugged and rocky conditions.",
        image: SepticSystem.src,
        images: [SepticSystem.src, SepticSystem2.src ],
      },
      {
        title: "Seepage Pit Performance Test",
        shortDescription: "For vertical disposal to decrease septic system footprint in certain County areas.",
        fullDescription: "For vertical disposal and to decrease septic system footprint, this type of system is allowed in certain areas of the County. Our partner company DrillEx does the drilling and excavation work in-house — no need to subcontract others!",
        image: rendimiento.src,
        images: [rendimiento.src, rendimiento2.src],
      },
      {
        title: "Conventional & Alternative Septic System Design Permits",
        shortDescription: "We design any ADEQ-approved wastewater system and handle all permitting.",
        fullDescription: "Because we study the soil ourselves, we can recommend and design any of the ADEQ-approved onsite wastewater treatment systems. We can take care of all the permitting, so you can get to the building!",
        image: pseticInstallation.src,
        images: [pseticInstallation.src,pseticInstallation2.src],
      },
      {
        title: "Septic System Installations",
        shortDescription: "We work alongside installers and contractors, treating everyone fairly.",
        fullDescription: "We work alongside many installers and contractors, and strive to treat everyone fairly and graciously. We mostly test, design and permit. We are not hesitant to promote our business associates and we don't undercut anybody!",
        image: ConstructionPermits.src,
        images: [ConstructionPermits.src, ConstructionPermits2.src, ConstructionPermits3.src],
      },
    ],
    es: [
      {
        title: "Evaluaciones de Sitio y Suelo",
        shortDescription: "¡Evalúa antes de construir! Evaluamos las condiciones del suelo para tu proyecto.",
        fullDescription: "¡Evalúa antes de construir! Esta evaluación se utiliza para sistemas de tratamiento de aguas residuales en sitio y para la Fase I de nuevos desarrollos, evaluando el horizonte del suelo, condiciones superficiales y subsuperficiales.",
        image: SoilExamination.src,
        images: [SoilExamination.src],
      },
      {
        title: "Pruebas de Percolación de Suelo",
        shortDescription: "Pruebas especializadas para especificar los requisitos de tu nuevo sistema séptico.",
        fullDescription: "Cuando existen condiciones limitantes, realizamos pruebas adicionales para especificar mejor los requisitos de tratamiento para tu nuevo sistema séptico. Generalmente requerida para condiciones muy accidentadas y rocosas.",
        image: SepticSystem.src,
        images: [SepticSystem.src, SepticSystem2.src],
      },
      {
        title: "Prueba de Rendimiento de Pozo de Absorción",
        shortDescription: "Para disposición vertical y reducir el área del sistema séptico en ciertas zonas.",
        fullDescription: "Para la disposición vertical y reducir el área del sistema séptico, este tipo de sistema está permitido en ciertas áreas del condado. Nuestra empresa asociada DrillEx realiza la perforación y excavación internamente.",
        image: rendimiento.src,
        images: [rendimiento.src, rendimiento2.src],
      },
      {
        title: "Permisos de Diseño de Sistemas Sépticos",
        shortDescription: "Diseñamos cualquier sistema aprobado por ADEQ y gestionamos todos los permisos.",
        fullDescription: "Como estudiamos el suelo nosotros mismos, podemos recomendar y diseñar cualquier sistema de tratamiento de aguas residuales aprobado por ADEQ. Nos encargamos de todos los permisos.",
        image: pseticInstallation.src,
        images: [pseticInstallation.src, pseticInstallation2.src],
      },
      {

        title: "Instalaciones de Sistemas Sépticos",
        shortDescription: "Trabajamos junto a instaladores y contratistas, tratando a todos con justicia.",
        fullDescription: "Trabajamos junto a muchos instaladores y contratistas, tratando a todos con justicia. Principalmente realizamos pruebas, diseño y permisos, promoviendo a nuestros socios comerciales.",
        image: ConstructionPermits.src,
        images: [ConstructionPermits.src, ConstructionPermits2.src, ConstructionPermits3.src],
      },
    ],
  };

  const currentServices = language === "es" ? services.es : services.en;
  const requestLabel = language === "es" ? "Solicitar este servicio" : "Request this service";

  return (
    <section id="services" className="services" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title" data-reveal>
          {language === "es" ? "NUESTROS SERVICIOS" : "OUR SERVICES"}
        </h2>
        <p className="section-subtitle" data-reveal>
          {language === "es"
            ? "Soluciones completas para tus necesidades sépticas y ambientales"
            : "Complete solutions for your septic and environmental needs"}
        </p>

        <div className="services-container">
          <div className="services-grid">
            {currentServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                shortDescription={service.shortDescription}
                image={service.image}
                onClick={() => setSelectedService(service)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          requestLabel={requestLabel}
        />
      )}
    </section>
  );
};

export default Services;