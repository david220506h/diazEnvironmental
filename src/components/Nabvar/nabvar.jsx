import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import logo from "../../../public/logo.png";

const Navbar = () => {
  const language = useStore(languageStore);
  const [click, setClick] = useState(false);
  const [scrollNav, setScrollNav] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const changeNav = () => { if (window.scrollY >= 80) { setScrollNav(true); } else { setScrollNav(false); } };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = [
        { id: "hero",     element: document.getElementById("hero")     },
        { id: "services", element: document.getElementById("services") },
        { id: "projects", element: document.getElementById("projects") },
        { id: "about",    element: document.getElementById("about")    },
        { id: "contact",  element: document.getElementById("contact")  },
      ].filter((s) => s.element !== null);
      const sectionPositions = sections.map((s) => ({
        id: s.id,
        offsetTop: s.element.offsetTop,
        offsetBottom: s.element.offsetTop + s.element.offsetHeight,
      }));
      for (let i = 0; i < sectionPositions.length; i++) {
        const { id, offsetTop, offsetBottom } = sectionPositions[i];
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          if (activeSection !== id) setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);
    return () => {
      window.removeEventListener("scroll", changeNav);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  const navLinks = [
    { to: "hero",     es: "INICIO",    en: "HOME"     },
    { to: "services", es: "SERVICIOS", en: "SERVICES" },
    { to: "about",    es: "NOSOTROS",  en: "ABOUT US" },
    { to: "projects", es: "PROYECTOS", en: "PROJECTS" },
    { to: "contact",  es: "CONTACTO",  en: "CONTACT"  },
  ];

  return (
    <nav className={scrollNav ? "navbar active" : "navbar"}>
      <div className="navbar-container">
        <a href="#hero" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={logo.src} alt="Diaz Environmental LLC" className="logo" /> Diaz Environmental
        </a>

        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={click ? "nav-menu active" : "nav-menu"}>
          {navLinks.map(({ to, es, en }) => (
            <li className="nav-item" key={to}>

               <a href={"#" + to}
                className={"nav-links" + (activeSection === to ? " active" : "")}
                onClick={() => { closeMobileMenu(); setActiveSection(to); }}
              >
                {language === "en" ? en : es}
              </a>
            </li>
          ))}
          <div className="cambio-idioma">
            {language === "es" && (
              <button onClick={() => { languageStore.set("en"); localStorage.setItem("language", "en"); }}>
                <img src="https://flagcdn.com/w40/us.png" alt="English" className="flag-img" />
                <span className="lang-text">EN</span>
              </button>
            )}
            {language === "en" && (
              <button onClick={() => { languageStore.set("es"); localStorage.setItem("language", "es"); }}>
                <img src="https://flagcdn.com/w40/mx.png" alt="Español" className="flag-img" />
                <span className="lang-text">ES</span>
              </button>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;