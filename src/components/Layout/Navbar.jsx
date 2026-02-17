import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const links = [
    { to: "/", label: t("navbar.home") },
    { to: "/experience", label: t("navbar.experience") },
    { to: "/education", label: t("navbar.education") },
    { to: "/contact", label: t("navbar.contact") }
  ];

  const closeMenu = () => setIsOpen(false);
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    closeMenu();
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={closeMenu}>
          {t("common.brandName")}
        </NavLink>

        <button
          className="navbar__toggle"
          aria-label={t("navbar.openMenu")}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
        </button>

        <nav className={`navbar__links ${isOpen ? "is-open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "is-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="navbar__languages" aria-label={t("navbar.changeLanguage")}>
            <button
              type="button"
              className={`navbar__language ${i18n.resolvedLanguage === "es" ? "is-active" : ""}`}
              onClick={() => changeLanguage("es")}
            >
              {t("navbar.spanish")}
            </button>
            <button
              type="button"
              className={`navbar__language ${i18n.resolvedLanguage === "en" ? "is-active" : ""}`}
              onClick={() => changeLanguage("en")}
            >
              {t("navbar.english")}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
