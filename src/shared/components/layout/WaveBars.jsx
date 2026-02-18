import { useMemo, useRef, useState, useCallback, useEffect } from "react";
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

/**
 * Returns the width in pixels of the wave-bars actions inner block.
 * Measures the actual rendered element so it stays correct when labels,
 * font or padding change.
 * @param {HTMLElement | null} element
 * @returns {number | null} Width in px, or null if element is missing.
 */
function getActionsInnerWidth(element) {
  if (!element || typeof element.getBoundingClientRect !== "function") return null;
  return element.getBoundingClientRect().width;
}

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
  return (
    WAVE_BARS_BASE_WEIGHT + (WAVE_BARS_PEAK_WEIGHT - WAVE_BARS_BASE_WEIGHT) * gaussian
  );
}

function getPointerBarIndex(clientY, rectHeight, rectTop) {
  if (rectHeight <= 0) return null;
  const y = clientY - rectTop;
  if (y < 0 || y > rectHeight) return null;
  const normalized = y / rectHeight;
  return normalized * (WAVE_BARS_COUNT - 1);
}

/**
 * Animated header bars that react to pointer position, with section
 * navigation buttons. Navigates to the home page when on a different route
 * and stores the target section for scroll-after-load.
 * @param {((widthPx: number | null) => void)} [onActionsInnerWidthChange]
 */
export default function WaveBars({ onActionsInnerWidthChange }) {
  const containerRef = useRef(null);
  const actionsInnerRef = useRef(null);
  const [mouseBarIndex, setMouseBarIndex] = useState(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Recalculate actions-inner width on mount, language change, or resize
  useEffect(() => {
    const el = actionsInnerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const width = getActionsInnerWidth(el);
      onActionsInnerWidthChange?.(width ?? null);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [i18n.language, onActionsInnerWidthChange]);

  const handleSectionClick = useCallback(
    (sectionId) => {
      if (pathname === "/") {
        const el = document.getElementById(sectionId);
        if (el)
          requestAnimationFrame(() =>
            el.scrollIntoView({ behavior: "smooth", block: "start" })
          );
      } else {
        sessionStorage.setItem(SCROLL_TO_SECTION_KEY, sectionId);
        navigate("/");
      }
    },
    [pathname, navigate]
  );

  const updateFromPointer = useCallback((clientY) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const height = rect.height || container.offsetHeight;
    setMouseBarIndex(getPointerBarIndex(clientY, height, rect.top));
  }, []);

  const weights = useMemo(
    () =>
      Array.from({ length: WAVE_BARS_COUNT }, (_, i) => getBarWeight(i, mouseBarIndex)),
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
        <div ref={actionsInnerRef} className="wave-bars__actions-inner">
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
