import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Project.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";

import project1 from "../../assets/images/projects/project1.jpg";
import project2 from "../../assets/images/projects/Project2.jpg";
import project3 from "../../assets/images/projects/Project3.jpg";
import project4 from "../../assets/images/projects/Project4.jpg";
import project6 from "../../assets/images/projects/Project6.jpg";

const useInView = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (options.once && isInView) return;
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: options.margin || "0px" }
    );
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [ref, options.once, options.margin, isInView]);
  return isInView;
};

const ProjectCard = ({ title, category, description, image, requestLabel }) => (
  <div className="project-card">
    <div className="project-image">
      <img src={image} alt={title} />
      <div className="project-category">{category}</div>
    </div>
    <div className="project-content">
      <h3 className="project-title">{title}</h3>
      <p className="project-description">{description}</p>
      <a href="#contact" className="project-link">{requestLabel}</a>
    </div>
  </div>
);

const Projects = () => {
  const language = useStore(languageStore);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  const [activeFilter, setActiveFilter] = useState("All");
  const [allProjectsData, setAllProjectsData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [canSwipe, setCanSwipe] = useState(true);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const projectsData = {
    en: [
      { title: "Residential Septic System Installation", category: "Septic Systems", description: "Complete installation of a modern septic system for a newly constructed residence in Phoenix. Included percolation testing, system design, permitting, and installation.", image: project1.src },
      { title: "Commercial Environmental Testing", category: "Environmental Testing", description: "Comprehensive soil and groundwater testing for a commercial development site in Scottsdale. Our report helped the client navigate regulatory requirements.", image: project2.src },
      { title: "Emergency Septic System Repair", category: "Septic Systems", description: "Rapid response and repair of a failed septic system for a family in Mesa. We diagnosed the issue and completed repairs within 48 hours.", image: project3.src },
      { title: "Multi-Property Septic Inspections", category: "Inspections", description: "Thorough septic system inspections for a real estate developer across multiple properties in Maricopa County.", image: project4.src },
      { title: "Annual Maintenance Program", category: "Maintenance", description: "Ongoing maintenance program for a community of homes in Gilbert, providing regular inspections, pumping, and preventative maintenance.", image: project6.src },
    ],
    es: [
      { title: "Instalación de Sistema Séptico Residencial", category: "Sistemas Sépticos", description: "Instalación completa de un sistema séptico moderno para una nueva residencia en Phoenix. Incluye pruebas de percolación, diseño del sistema y permisos.", image: project1.src },
      { title: "Pruebas Ambientales Comerciales", category: "Pruebas Ambientales", description: "Pruebas integrales de suelo y agua subterránea para un sitio de desarrollo comercial en Scottsdale.", image: project2.src },
      { title: "Reparación de Emergencia de Sistema Séptico", category: "Sistemas Sépticos", description: "Respuesta rápida y reparación de un sistema séptico fallido para una familia en Mesa. Diagnóstico y reparaciones completadas en 48 horas.", image: project3.src },
      { title: "Inspecciones en Múltiples Propiedades", category: "Inspecciones", description: "Inspecciones exhaustivas de sistemas sépticos para un desarrollador inmobiliario en el Condado de Maricopa.", image: project4.src },
      { title: "Programa de Mantenimiento Anual", category: "Mantenimiento", description: "Programa de mantenimiento continuo para una comunidad de hogares en Gilbert, con inspecciones regulares y mantenimiento preventivo.", image: project6.src },
    ],
  };

  useEffect(() => {
    const data = language === "es" ? projectsData.es : projectsData.en;
    setAllProjectsData(data);
    setFilteredProjects(data);
    setActiveFilter("All");
    setCurrentIndex(0);
  }, [language]);

  const allLabel = language === "es" ? "Todos" : "All";
  const categories = allProjectsData.length > 0
    ? [allLabel, ...new Set(allProjectsData.map(p => p.category))]
    : [allLabel];

  useEffect(() => {
    if (activeFilter === allLabel) {
      setFilteredProjects(allProjectsData);
    } else {
      setFilteredProjects(allProjectsData.filter(p => p.category === activeFilter));
    }
    setCurrentIndex(0);
  }, [activeFilter, allProjectsData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { setCardsToShow(1); setIsMobile(true); }
      else if (window.innerWidth < 1024) { setCardsToShow(2); setIsMobile(false); }
      else { setCardsToShow(3); setIsMobile(false); }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (!canSwipe) return;
    setCanSwipe(false);
    setCurrentIndex(prev => prev < filteredProjects.length - cardsToShow ? prev + 1 : 0);
    setTimeout(() => setCanSwipe(true), 500);
  };

  const prevSlide = () => {
    if (!canSwipe) return;
    setCanSwipe(false);
    setCurrentIndex(prev => prev > 0 ? prev - 1 : Math.max(0, filteredProjects.length - cardsToShow));
    setTimeout(() => setCanSwipe(true), 500);
  };

  const handleTouchStart = (e) => { setStartX(e.touches[0].clientX); setIsDragging(true); };
  const handleTouchMove = (e) => { if (!isDragging) return; e.preventDefault(); };
  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) { diffX > 0 ? nextSlide() : prevSlide(); }
    setIsDragging(false);
  };

  const cardWidth = 100 / cardsToShow;
  const maxIndex = Math.max(0, filteredProjects.length - cardsToShow);
  const requestLabel = language === "es" ? "Solicitar servicio similar" : "Request similar service";

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2
          className="section-title"
          ref={sectionRef}
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(-30px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {language === "es" ? "NUESTROS PROYECTOS" : "OUR PROJECTS"}
        </h2>
        <p className="section-subtitle" style={{ opacity: isInView ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
          {language === "es"
            ? "Una muestra de nuestro trabajo reciente e implementaciones exitosas"
            : "A showcase of our recent work and successful implementations"}
        </p>

        <div className="projects-filter">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`filter-btn ${activeFilter === category ? "active" : ""}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={`carousel-container ${isMobile ? "mobile-carousel" : ""}`}>
          {!isMobile && (
            <button className="carousel-arrow prev" onClick={prevSlide} disabled={!canSwipe}>
              <FaChevronLeft />
            </button>
          )}
          <div className="carousel-wrapper" ref={carouselRef}>
            {isMobile && <div className="swipe-instruction"><span>{language === "es" ? "Desliza para navegar" : "Swipe to navigate"}</span></div>}
            <div
              className="carousel-track"
              style={{ transform: `translateX(${-currentIndex * cardWidth}%)` }}
              onTouchStart={isMobile ? handleTouchStart : null}
              onTouchMove={isMobile ? handleTouchMove : null}
              onTouchEnd={isMobile ? handleTouchEnd : null}
            >
              {filteredProjects.map((project, index) => (
                <div key={index} className="carousel-item" style={{ width: `${cardWidth}%` }}>
                  <ProjectCard
                    title={project.title}
                    category={project.category}
                    description={project.description}
                    image={project.image}
                    requestLabel={requestLabel}
                  />
                </div>
              ))}
            </div>
          </div>
          {!isMobile && (
            <button className="carousel-arrow next" onClick={nextSlide} disabled={!canSwipe}>
              <FaChevronRight />
            </button>
          )}
        </div>

        <div className="carousel-indicators">
          {maxIndex > 0 && Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => { if (canSwipe) { setCanSwipe(false); setCurrentIndex(index); setTimeout(() => setCanSwipe(true), 500); } }}
              disabled={!canSwipe}
            />
          ))}
        </div>

        <div className="projects-cta">
          <p>{language === "es" ? "¿Buscas un tipo específico de proyecto o servicio?" : "Looking for a specific type of project or service?"}</p>
          <a href="#contact" className="cta-button">
            {language === "es" ? "Contáctanos para una consulta" : "Contact us for a consultation"}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;