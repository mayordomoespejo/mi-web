import BrandMme from "./BrandMme";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * Panel con borde inferior escalonado.
 * Incluye el brand "mme" a la izquierda y el selector de idioma (es/en) a la derecha.
 */
export default function SteppedPanel() {
  return (
    <div className="stepped-panel" role="banner">
      <div className="stepped-panel__inner">
        <div className="stepped-panel__content">
          <div className="stepped-panel__left">
            <BrandMme />
            <span className="stepped-panel__subtitle" aria-hidden="true">
              Desarrollador Frontend / Mobile
            </span>
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
