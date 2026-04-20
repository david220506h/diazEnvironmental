import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaPhone, FaStar, FaShieldAlt, FaClock, FaHeart } from "react-icons/fa";
import "./SobreNosotros.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import teamPhoto from "../../assets/hero2.jpeg";

const Icon = ({ icon: IconComponent }) => IconComponent ? <IconComponent /> : null;

const stats = [
  { value: "100%", label: { es: "Compromiso total",    en: "Total commitment"  } },
  { value: "0",    label: { es: "Quejas registradas",  en: "Complaints filed"  } },
  { value: "A+",   label: { es: "Actitud de servicio", en: "Service attitude"  } },
  { value: "∞",    label: { es: "Ganas de crecer",     en: "Drive to grow"     } },
];

const features = [
  { icon: FaStar,        es: "Equipo joven con energía y dedicación",          en: "Young team with energy and dedication"  },
  { icon: FaCheckCircle, es: "Atención personalizada en cada servicio",        en: "Personalized attention on every job"    },
  { icon: FaClock,       es: "Puntuales y comprometidos con tu tiempo",        en: "Punctual and respectful of your time"   },
  { icon: FaHeart,       es: "Nos importa tu espacio como si fuera el nuestro",en: "We care for your space like it's our own"},
  { icon: FaShieldAlt,   es: "Trabajamos con honestidad y transparencia",      en: "We work with honesty and transparency"  },
];

const translations = {
  es: {
    tag: "SOBRE NOSOTROS",
    title: "Nuevos, pero con todo el fuego para destacar.",
    description: "Diaz Cleaning LLC es una empresa nueva, pero eso no nos detiene — al contrario, nos impulsa. Llegamos con energía, con hambre de demostrar lo que somos capaces de hacer y con un compromiso real hacia cada cliente. Sabemos que la confianza se gana con trabajo y resultados, y eso es exactamente lo que ofrecemos: esfuerzo genuino, atención al detalle y las ganas de convertirnos en la mejor opción de limpieza en la región.",
    satisfaction: "Nivel de compromiso",
    cta: "Solicitar servicio",
    call: "¿Preguntas? Llámanos",
  },
  en: {
    tag: "ABOUT US",
    title: "New to the game, but here to make a mark.",
    description: "Diaz Cleaning LLC is a new company — and that's exactly what drives us. We show up with energy, hunger to prove ourselves, and a real commitment to every single client. We know trust is earned through hard work and results, and that's exactly what we deliver: genuine effort, attention to detail, and the drive to become the top cleaning choice in the region.",
    satisfaction: "Commitment level",
    cta: "Request a service",
    call: "Questions? Call us",
  },
};

const AboutUs = () => {
  const language = useStore(languageStore);
  const [barAnimated, setBarAnimated] = useState(false);
  const sectionRef = useRef(null);
  const t = translations[language] || translations.es;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarAnimated(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="about-blob" aria-hidden="true" />

      <div className="about-container">
        <div className="about-image-col">
          <div className="about-image-wrap">
            <img src={teamPhoto.src} alt="Diaz Cleaning team" className="about-img" />
            <div className="about-badge">
              <span className="badge-num">A+</span>
              <span className="badge-txt">BBB</span>
            </div>
          </div>
        </div>

        <div className="about-content-col">
          <span className="about-tag">{t.tag}</span>
          <h2 className="about-title">{t.title}</h2>
          <p className="about-desc">{t.description}</p>

          <ul className="about-features">
            {features.map((f, i) => (
              <li key={i} className="about-feature-item" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="feature-icon">
                  <Icon icon={f.icon} />
                </span>
                <span>{language === "en" ? f.en : f.es}</span>
              </li>
            ))}
          </ul>

          <div className="about-stats">
            {stats.map((s, i) => (
              <div className="stat-item" key={i}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{language === "en" ? s.label.en : s.label.es}</span>
              </div>
            ))}
          </div>

          <div className="about-bar-wrap">
            <div className="bar-header">
              <span>{t.satisfaction}</span>
              <span className="bar-pct">95%</span>
            </div>
            <div className="bar-track">
              <div className={`bar-fill ${barAnimated ? "animated" : ""}`} />
            </div>
          </div>

          <div className="about-cta-row">
            <a href="#contact" className="about-cta-btn">{t.cta}</a>
            <div className="about-phone">
              <div className="phone-icon-wrap"><FaPhone /></div>
              <div>
                <span className="phone-label">{t.call}</span>
                <span className="phone-number">(480) 479-4507</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;