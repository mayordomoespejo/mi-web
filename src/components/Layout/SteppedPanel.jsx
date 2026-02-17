import { useTranslation } from "react-i18next";
import BrandMme from "./BrandMme";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * Panel con borde inferior escalonado: brand "mme" y rol a la izquierda, selector de idioma a la derecha.
 * @returns {JSX.Element}
 */
export default function SteppedPanel() {
  const { t } = useTranslation();
  const roleLabel = t("home.role");

  return (
    <div className="stepped-panel">
      <div className="stepped-panel__inner">
        <div className="stepped-panel__content">
          <div className="stepped-panel__left">
            <BrandMme />
            <span className="stepped-panel__subtitle">{roleLabel}</span>
          </div>
          <div className="stepped-panel__separator" aria-hidden="true" />
          <div className="stepped-panel__right">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
