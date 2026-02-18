import { useTranslation } from "react-i18next";

/**
 * Language toggle buttons (es/en). Optionally notifies parent on change.
 * @param {Object} props
 * @param {(() => void)|undefined} props.onLanguageChange - Optional callback on language change.
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
        className={`language-switcher__btn${i18n.resolvedLanguage === "es" ? " language-switcher__btn--active" : ""}`}
        onClick={() => changeLanguage("es")}
      >
        {t("navbar.spanish")}
      </button>
      <button
        type="button"
        className={`language-switcher__btn${i18n.resolvedLanguage === "en" ? " language-switcher__btn--active" : ""}`}
        onClick={() => changeLanguage("en")}
      >
        {t("navbar.english")}
      </button>
    </div>
  );
}
