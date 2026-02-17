import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BrandMme from "./BrandMme";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // Experiencia y Formación como un solo bloque de navegación
  const links = [
    { to: "/", label: t("navbar.home") },
    {
      group: true,
      ariaLabel: t("navbar.experienceAndEducation"),
      items: [
        { to: "/experience", label: t("navbar.experience") },
        { to: "/education", label: t("navbar.education") }
      ]
    },
    { to: "/contact", label: t("navbar.contact") }
  ];

  const closeMenu = () => setIsOpen(false);
  const handleBrandClick = () => {
    closeMenu();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <BrandMme onClick={handleBrandClick} />

        <button
          className="navbar__toggle"
          aria-label={t("navbar.openMenu")}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
        </button>

        <nav className={`navbar__links ${isOpen ? "is-open" : ""}`}>
          {links.map((link) =>
            link.group ? (
              <div
                key="experience-education"
                className="navbar__link-group"
                role="group"
                aria-label={link.ariaLabel}
              >
                {link.items.map((item, idx) => (
                  <span key={item.to} className="navbar__link-group-item">
                    {idx > 0 && (
                      <span
                        className="navbar__link-group-sep"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                    )}
                    <NavLink
                      to={item.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `navbar__link ${isActive ? "is-active" : ""}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </span>
                ))}
              </div>
            ) : (
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
            )
          )}
          <LanguageSwitcher onLanguageChange={closeMenu} />
        </nav>
      </div>
    </header>
  );
}
