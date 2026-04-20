import { useState } from "react";
import "./Servicios.css";
import { FaBroom, FaBuilding, FaHome, FaWindowRestore, FaIndustry, FaRegBuilding, FaTimes } from 'react-icons/fa';
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";

// Helper para renderizar iconos
const Icon = ({ icon: IconComponent }) => IconComponent ? <IconComponent /> : <FaBroom />;

const serviciosEspañol = [
  { titulo: 'Limpieza Profunda',     descripcion: 'Limpieza exhaustiva de todos los espacios, incluyendo áreas de difícil acceso.', categoria: 'Especializada', icono: FaBroom,         destacado: true },
  { titulo: 'Limpieza de Ventanas',  descripcion: 'Limpieza profesional de ventanas interiores y exteriores.',                      categoria: 'Especializada', icono: FaWindowRestore },
  { titulo: 'Limpieza de Oficinas',  descripcion: 'Mantenimiento y limpieza profesional para espacios corporativos.',               categoria: 'Comercial',     icono: FaBuilding      },
  { titulo: 'Limpieza Industrial',   descripcion: 'Servicios especializados para plantas y espacios industriales.',                 categoria: 'Comercial',     icono: FaIndustry      },
  { titulo: 'Servicios para el Hogar', descripcion: 'Limpieza profesional adaptada a las necesidades de tu hogar.',               categoria: 'Residencial',   icono: FaHome          },
  { titulo: 'Limpieza de Edificios', descripcion: 'Mantenimiento integral para edificios residenciales y condominios.',            categoria: 'Residencial',   icono: FaRegBuilding   },
  { titulo: 'Servicios de Limpieza', descripcion: 'Amplia gama de soluciones de limpieza para todo tipo de necesidades.',          categoria: 'General',       icono: FaBroom         },
];

const serviciosEnglish = [
  { titulo: 'Deep Cleaning',      descripcion: 'Exhaustive cleaning of all spaces, including hard-to-reach areas.',         categoria: 'Specialized',  icono: FaBroom,         destacado: true },
  { titulo: 'Window Cleaning',    descripcion: 'Professional cleaning of interior and exterior windows.',                   categoria: 'Specialized',  icono: FaWindowRestore },
  { titulo: 'Office Cleaning',    descripcion: 'Professional maintenance and cleaning for corporate spaces.',               categoria: 'Commercial',   icono: FaBuilding      },
  { titulo: 'Industrial Cleaning',descripcion: 'Specialized services for plants and industrial spaces.',                   categoria: 'Commercial',   icono: FaIndustry      },
  { titulo: 'Standard Cleaning',  descripcion: 'Regular cleaning service to keep your space spotless.',                    categoria: 'Residential',  icono: FaHome          },
  { titulo: 'Building Cleaning',  descripcion: 'Comprehensive maintenance for residential buildings and condos.',          categoria: 'Residential',  icono: FaRegBuilding   },
  { titulo: 'Cleaning Services',  descripcion: 'Wide range of cleaning solutions for all types of needs.',                 categoria: 'General',      icono: FaBroom         },
];

const categoryIcons = {
  'Especializada': FaBroom,
  'Specialized':   FaBroom,
  'Comercial':     FaBuilding,
  'Commercial':    FaBuilding,
  'Residencial':   FaHome,
  'Residential':   FaHome,
  'General':       FaRegBuilding,
};

const translations = {
  es: {
    title: 'Servicios de Limpieza Profesional',
    subtitle: 'Ofrecemos soluciones personalizadas para cada necesidad',
    categories: {
      'Especializada': 'Limpieza Especializada',
      'Specialized':   'Limpieza Especializada',
      'Comercial':     'Limpieza Comercial',
      'Commercial':    'Limpieza Comercial',
      'Residencial':   'Limpieza Residencial',
      'Residential':   'Limpieza Residencial',
      'General':       'Servicios Generales',
    },
    button: 'Ver Servicios',
    close: 'Cerrar',
    servicesIn: 'Servicios en',
  },
  en: {
    title: 'Professional Cleaning Services',
    subtitle: 'We offer personalized solutions for every need',
    categories: {
      'Especializada': 'Specialized Cleaning',
      'Specialized':   'Specialized Cleaning',
      'Comercial':     'Commercial Cleaning',
      'Commercial':    'Commercial Cleaning',
      'Residencial':   'Residential Cleaning',
      'Residential':   'Residential Cleaning',
      'General':       'General Services',
    },
    button: 'View Services',
    close: 'Close',
    servicesIn: 'Services in',
  },
};

const Servicios = () => {
  const language = useStore(languageStore);
  const servicios = language === "en" ? serviciosEnglish : serviciosEspañol;
  const [activeCategory, setActiveCategory] = useState(null);
  const [closing, setClosing] = useState(false);

  const t = translations[language] || translations.es;
  const categorias = [...new Set(servicios.map(s => s.categoria))];

  const handleOpen = (categoria) => { setClosing(false); setActiveCategory(categoria); };
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setActiveCategory(null); setClosing(false); }, 350);
  };

  const activeServices = servicios.filter(s => s.categoria === activeCategory);

  return (
    <section className="servicios-section" id="services">
      <div className="servicios-header">
        <h2>{t.title}</h2>
        <p className="servicios-subtitle">{t.subtitle}</p>
      </div>

      <div className="categorias-wrapper">
        {categorias.map((categoria, catIdx) => {
          const count = servicios.filter(s => s.categoria === categoria).length;
          return (
            <div
              key={catIdx}
              className={`categoria-card ${activeCategory === categoria ? 'active' : ''}`}
              style={{ animationDelay: `${catIdx * 0.12}s` }}
            >
              <div className="categoria-card-icon">
                <Icon icon={categoryIcons[categoria]} />
              </div>
              <h3 className="categoria-card-titulo">
                {t.categories[categoria] || categoria}
              </h3>
              <p className="categoria-card-count">
                {count} {language === "en" ? "services" : "servicios"}
              </p>
              <button className="categoria-btn" onClick={() => handleOpen(categoria)}>
                {t.button}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          );
        })}
      </div>

      {activeCategory && (
        <div className={`servicios-overlay ${closing ? 'closing' : 'opening'}`} onClick={handleClose}>
          <div
            className={`servicios-panel ${closing ? 'panel-closing' : 'panel-opening'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="panel-header">
              <div className="panel-header-icon">
                <Icon icon={categoryIcons[activeCategory]} />
              </div>
              <div>
                <span className="panel-label">{t.servicesIn}</span>
                <h3 className="panel-title">{t.categories[activeCategory] || activeCategory}</h3>
              </div>
              <button className="panel-close" onClick={handleClose}>
                <FaTimes />
              </button>
            </div>

            <div className="panel-services-list">
              {activeServices.map((servicio, idx) => (
                <div
                  key={idx}
                  className={`panel-service-item ${servicio.destacado ? 'destacado' : ''}`}
                  style={{ animationDelay: `${0.08 + idx * 0.1}s` }}
                >
                  <div className="panel-service-icon">
                    <Icon icon={servicio.icono} />
                  </div>
                  <div className="panel-service-info">
                    <h4>{servicio.titulo}</h4>
                    <p>{servicio.descripcion}</p>
                  </div>
                  {servicio.destacado && (
                    <span className="badge">{language === "en" ? "Featured" : "Destacado"}</span>
                  )}
                </div>
              ))}
            </div>

            <a href="#contact" className="panel-cta" onClick={handleClose}>
              {language === "en" ? "Request this service" : "Solicitar este servicio"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default Servicios;