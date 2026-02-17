import { useMemo, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SCROLL_TO_SECTION_KEY,
  HOME_SECTION_IDS,
  WAVE_BARS_COUNT,
  WAVE_BARS_BASE_WEIGHT,
  WAVE_BARS_PEAK_WEIGHT,
  WAVE_BARS_SIGMA
} from "@/core/constants";

const WAVE_SECTIONS = [
  { id: HOME_SECTION_IDS.EXPERIENCE, labelKey: "home.sectionExperience" },
  { id: HOME_SECTION_IDS.EDUCATION, labelKey: "home.sectionEducation" }
];

/**
 * Visual weight for a bar based on distance to pointer (gaussian wave).
 */
function getBarWeight(barIndex, mouseBarIndex) {
  if (mouseBarIndex == null) return WAVE_BARS_BASE_WEIGHT;
  const distance = barIndex - mouseBarIndex;
  const gaussian = Math.exp(
    -(distance * distance) / (2 * WAVE_BARS_SIGMA * WAVE_BARS_SIGMA)
  );
  return WAVE_BARS_BASE_WEIGHT + (WAVE_BARS_PEAK_WEIGHT - WAVE_BARS_BASE_WEIGHT) * gaussian;
}

function getPointerBarIndex(clientY, rectHeight, rectTop) {
  if (rectHeight <= 0) return null;
  const y = clientY - rectTop;
  if (y < 0 || y > rectHeight) return null;
  const normalized = y / rectHeight;
  return normalized * (WAVE_BARS_COUNT - 1);
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

  const handleSectionClick = useCallback(
    (sectionId) => {
      if (pathname === "/") {
        const el = document.getElementById(sectionId);
        if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
      } else {
        sessionStorage.setItem(SCROLL_TO_SECTION_KEY, sectionId);
        navigate("/");
      }
    },
    [pathname, navigate]
  );

  const updateFromPointer = (clientY) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const height = rect.height || container.offsetHeight;
    setMouseBarIndex(getPointerBarIndex(clientY, height, rect.top));
  };

  const weights = useMemo(
    () => Array.from({ length: WAVE_BARS_COUNT }, (_, i) => getBarWeight(i, mouseBarIndex)),
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
          <div key={i} className="wave-bars__bar" style={{ flexGrow: weight }} />
        ))}
      </div>
      <div className="wave-bars__actions">
        <div className="wave-bars__actions-inner">
          <div
            className="wave-bars__block"
            role="group"
            aria-label={t("home.scrollToNext")}
          >
            {WAVE_SECTIONS.map(({ id, labelKey }) => (
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
