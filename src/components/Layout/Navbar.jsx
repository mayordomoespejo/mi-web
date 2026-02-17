import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/experience", label: "Experience" },
  { to: "/education", label: "Education" },
  { to: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={closeMenu}>
          Miguel Mayordomo
        </NavLink>

        <button
          className="navbar__toggle"
          aria-label="Abrir menú"
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
        </nav>
      </div>
    </header>
  );
}
