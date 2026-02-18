import { useTranslation } from "react-i18next";
import BrandMme from "./BrandMme";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * Panel with stepped bottom border: brand "mme" and role on the left,
 * language switcher on the right.
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
