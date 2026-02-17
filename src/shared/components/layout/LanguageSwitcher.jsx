import { useTranslation } from "react-i18next";

/**
 * Botones para cambiar idioma (es/en). Opcionalmente notifica al cambiar (p. ej. cerrar menú).
 * @param {Object} props
 * @param {(() => void)|undefined} props.onLanguageChange - Callback opcional al cambiar de idioma.
 * @returns {JSX.Element}
 */
export default function LanguageSwitcher({ onLanguageChange }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    if (onLanguageChange) onLanguageChange();
  };

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t("navbar.changeLanguage")}
    >
      <button
        type="button"
        className={`language-switcher__btn ${i18n.resolvedLanguage === "es" ? "is-active" : ""}`}
        onClick={() => changeLanguage("es")}
      >
        {t("navbar.spanish")}
      </button>
      <button
        type="button"
        className={`language-switcher__btn ${i18n.resolvedLanguage === "en" ? "is-active" : ""}`}
        onClick={() => changeLanguage("en")}
      >
        {t("navbar.english")}
      </button>
    </div>
  );
}
