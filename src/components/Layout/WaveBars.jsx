import { useMemo, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const NUM_BARS = 16;

/** IDs de secciones en la home y clave i18n del label del botón (solo experiencia y educación). */
const HOME_SECTIONS = [
  { id: "home-experience", labelKey: "home.sectionExperience" },
  { id: "home-education", labelKey: "home.sectionEducation" }
];
const BASE_WEIGHT = 1;
const PEAK_WEIGHT = 5;
const WAVE_SIGMA = 2;

/**
 * Peso visual de una barra según la distancia al índice bajo el puntero (efecto onda gaussiana).
 * @param {number} barIndex - Índice de la barra.
 * @param {number|null} mouseBarIndex - Índice de barra bajo el puntero, o null.
 * @returns {number} Valor de flex-grow para la barra.
 */
function getBarWeight(barIndex, mouseBarIndex) {
  if (mouseBarIndex == null) return BASE_WEIGHT;
  const distance = barIndex - mouseBarIndex;
  const gaussian = Math.exp(
    -(distance * distance) / (2 * WAVE_SIGMA * WAVE_SIGMA)
  );
  return BASE_WEIGHT + (PEAK_WEIGHT - BASE_WEIGHT) * gaussian;
}

function getPointerBarIndex(clientY, rectHeight, rectTop) {
  if (rectHeight <= 0) return null;

  const y = clientY - rectTop;
  if (y < 0 || y > rectHeight) return null;

  const normalized = y / rectHeight;
  return normalized * (NUM_BARS - 1);
}

/**
 * Cabecera con barras animadas que reaccionan al puntero y botones de scroll a las secciones de la home.
 * Si el usuario está en otra página, navega a la home y le indica la sección a la que ir.
 * @returns {JSX.Element}
 */
export default function WaveBars() {
  const containerRef = useRef(null);
  const [mouseBarIndex, setMouseBarIndex] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSectionClick = useCallback((sectionId) => {
    if (pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    } else {
      sessionStorage.setItem("scrollToSection", sectionId);
      navigate("/");
    }
  }, [pathname, navigate]);

  const updateFromPointer = (clientY) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const height = rect.height || container.offsetHeight;
    setMouseBarIndex(getPointerBarIndex(clientY, height, rect.top));
  };

  const weights = useMemo(
    () =>
      Array.from({ length: NUM_BARS }, (_, i) =>
        getBarWeight(i, mouseBarIndex)
      ),
    [mouseBarIndex]
  );

  return (
    <div
      ref={containerRef}
      className="wave-bars"
      onPointerEnter={(e) => updateFromPointer(e.clientY)}
      onPointerMove={(e) => updateFromPointer(e.clientY)}
      onPointerLeave={() => setMouseBarIndex(null)}
    >
      <div className="wave-bars__bars" role="presentation" aria-hidden="true">
        {weights.map((weight, i) => (
          <div
            key={i}
            className="wave-bars__bar"
            style={{ flexGrow: weight }}
          />
        ))}
      </div>
      <div className="wave-bars__actions">
        <div className="wave-bars__actions-inner">
          <div
            className="wave-bars__block"
            role="group"
            aria-label={t("home.scrollToNext")}
          >
            {HOME_SECTIONS.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                className="wave-bars__btn"
                onClick={() => handleSectionClick(id)}
                aria-label={t(labelKey)}
              >
                <span className="wave-bars__btn-text">{t(labelKey)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
