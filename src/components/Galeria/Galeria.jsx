import { useState, useRef } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";
import "./Galeria.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";

// ✅ Rutas corregidas
import img1  from "../../assets/Galeria/img1.jpeg";
import img2  from "../../assets/Galeria/img2.jpeg";
import img3  from "../../assets/Galeria/img3.jpeg";
import img4  from "../../assets/Galeria/img4.jpeg";
import img5  from "../../assets/Galeria/img5.jpeg";
import img15 from "../../assets/Galeria/img15.jpeg";
import img7  from "../../assets/Galeria/img7.jpeg";
import img14 from "../../assets/Galeria/img14.jpeg";
import img17 from "../../assets/Galeria/img17.jpeg";
import img9  from "../../assets/Galeria/img9.jpeg";
import img10 from "../../assets/Galeria/img10.jpeg";

const photos = [
  { src: img1.src,  category: { es: "Residencial", en: "Residential" } },
  { src: img2.src,  category: { es: "Residencial", en: "Residential" } },
  { src: img3.src,  category: { es: "Oficinas",    en: "Offices"     } },
  { src: img4.src,  category: { es: "Residencial", en: "Residential" } }, // ← quitado el espacio extra
  { src: img5.src,  category: { es: "Residencial", en: "Residential" } },
  { src: img15.src, category: { es: "Residencial", en: "Residential" } },
  { src: img7.src,  category: { es: "Comercial",   en: "Commercial"  } },
  { src: img14.src, category: { es: "Oficinas",    en: "Offices"     } },
  { src: img17.src, category: { es: "Industrial",  en: "Industrial"  } },
  { src: img9.src,  category: { es: "Industrial",  en: "Industrial"  }, beforeAfter: "before" },
  { src: img10.src, category: { es: "Industrial",  en: "Industrial"  }, beforeAfter: "after"  },
];

const BeforeAfter = ({ beforeSrc, afterSrc }) => {
  const wrapRef = useRef(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  const setPos = (clientX) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const p = Math.min(Math.max((clientX - rect.left) / rect.width * 100, 2), 98);
    setPct(p);
  };

  return (
    <div
      ref={wrapRef}
      className="ba-wrap"
      onMouseDown={e => { dragging.current = true; setPos(e.clientX); }}
      onMouseMove={e => { if (dragging.current) setPos(e.clientX); }}
      onMouseUp={() => dragging.current = false}
      onMouseLeave={() => dragging.current = false}
      onTouchStart={e => { dragging.current = true; setPos(e.touches[0].clientX); }}
      onTouchMove={e => { if (dragging.current) setPos(e.touches[0].clientX); }}
      onTouchEnd={() => dragging.current = false}
    >
      <img src={beforeSrc} alt="Before" className="ba-after-img" />
      <div className="ba-before-clip" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <img src={afterSrc} alt="After" />
      </div>
      <div className="ba-divider" style={{ left: `${pct}%` }}>
        <div className="ba-handle">⇔</div>
      </div>
      <span className="ba-label-before" onClick={() => setPct(2)}>Before</span>
      <span className="ba-label-after"  onClick={() => setPct(98)}>After</span>
    </div>
  );
};

const Gallery = () => {
  const language = useStore(languageStore);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [closing, setClosing] = useState(false);

  const translations = {
    es: {
      tag: "NUESTRO TRABAJO", title: "Galería de proyectos",
      subtitle: "Cada espacio que limpiamos habla por nosotros.",
      all: "Todos", filters: ["Residencial", "Comercial", "Oficinas", "Industrial"],
    },
    en: {
      tag: "OUR WORK", title: "Project Gallery",
      subtitle: "Every space we clean speaks for itself.",
      all: "All", filters: ["Residential", "Commercial", "Offices", "Industrial"],
    },
  };

  const t = translations[language] ?? translations.en;
  const categoryKey = language === "en" ? "en" : "es";

  const filtered = activeFilter === "all"
    ? photos.filter(p => !p.beforeAfter)
    : photos.filter(p => p.category[categoryKey] === activeFilter && !p.beforeAfter);

  const openLightbox  = (idx) => { setClosing(false); setLightbox(idx); };
  const closeLightbox = () => {
    setClosing(true);
    setTimeout(() => { setLightbox(null); setClosing(false); }, 300);
  };
  const prev = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  const next = () => setLightbox(i => (i + 1) % filtered.length);
  const handleKey = (e) => {
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape")     closeLightbox();
  };

  const beforePhoto = photos.find(p => p.beforeAfter === "before");
  const afterPhoto  = photos.find(p => p.beforeAfter === "after");

  return (
    <section className="gallery-section" id="projects">
      <div className="gallery-header">
        <span className="gallery-tag">{t.tag}</span>
        <h2 className="gallery-title">{t.title}</h2>
        <p className="gallery-subtitle">{t.subtitle}</p>
      </div>

      <div className="gallery-filters">
        <button
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          {t.all}
        </button>
        {t.filters.map((f, i) => (
          <button
            key={i}
            className={`filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filtered.map((photo, idx) => (
          <div
            key={idx}
            className="gallery-item"
            style={{ animationDelay: `${idx * 0.07}s` }}
            onClick={() => openLightbox(idx)}
          >
            <img src={photo.src} alt={photo.category[categoryKey]} loading="lazy" />
            <div className="gallery-item-overlay">
              <FaExpand className="overlay-icon" />
              <span className="overlay-cat">{photo.category[categoryKey]}</span>
            </div>
          </div>
        ))}
      </div>

      {beforePhoto && afterPhoto && (
        <div className="ba-wrap-container">
          <BeforeAfter beforeSrc={beforePhoto.src} afterSrc={afterPhoto.src} />
        </div>
      )}

      {lightbox !== null && (
        <div
          className={`lightbox-overlay ${closing ? "closing" : "opening"}`}
          onClick={closeLightbox}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          <button className="lightbox-close" onClick={closeLightbox}><FaTimes /></button>
          <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); prev(); }}>
            <FaChevronLeft />
          </button>
          <div
            className={`lightbox-img-wrap ${closing ? "lb-closing" : "lb-opening"}`}
            onClick={e => e.stopPropagation()}
          >
            <img src={filtered[lightbox].src} alt="" />
            <span className="lightbox-cat">{filtered[lightbox].category[categoryKey]}</span>
            <span className="lightbox-counter">{lightbox + 1} / {filtered.length}</span>
          </div>
          <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); next(); }}>
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;