import { useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NUM_BARS = 16;
const BASE_WEIGHT = 1;
const PEAK_WEIGHT = 5;
const WAVE_SIGMA = 2;

function getBarWeight(barIndex, mouseBarIndex) {
  if (mouseBarIndex == null) return BASE_WEIGHT;
  const distance = barIndex - mouseBarIndex;
  const gaussian = Math.exp(
    -(distance * distance) / (2 * WAVE_SIGMA * WAVE_SIGMA)
  );
  return BASE_WEIGHT + (PEAK_WEIGHT - BASE_WEIGHT) * gaussian;
}

export default function WaveBars() {
  const containerRef = useRef(null);
  const [mouseBarIndex, setMouseBarIndex] = useState(null);
  const { t } = useTranslation();

  const updateFromPointer = (clientY) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const height = rect.height || container.offsetHeight;
    if (height <= 0) {
      setMouseBarIndex(null);
      return;
    }

    const y = clientY - rect.top;
    if (y < 0 || y > height) {
      setMouseBarIndex(null);
      return;
    }

    const normalized = y / height;
    setMouseBarIndex(normalized * (NUM_BARS - 1));
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
            aria-label={t("navbar.experienceAndEducation")}
          >
            <NavLink
              to="/experience"
              className={({ isActive }) =>
                `wave-bars__btn ${isActive ? "is-active" : ""}`
              }
            >
              <span className="wave-bars__btn-text">
                {t("navbar.experience")}
              </span>
            </NavLink>
            <NavLink
              to="/education"
              className={({ isActive }) =>
                `wave-bars__btn ${isActive ? "is-active" : ""}`
              }
            >
              <span className="wave-bars__btn-text">
                {t("navbar.education")}
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
