import { useState } from "react";
import { useTranslation } from "react-i18next";

// Genera un punto de salida aleatorio para una letra
function getRandomLetterStart() {
  const r = (min, max) => min + Math.random() * (max - min);
  return {
    "--start-x": `${r(-120, 120)}vw`,
    "--start-y": `${r(-80, 120)}vh`,
    "--start-z": `${r(-200, -60)}px`,
    "--start-scale": r(0.2, 0.5),
    "--start-rotate-x": `${r(-85, 85)}deg`,
    "--start-rotate-y": `${r(-85, 85)}deg`,
    "--start-rotate-z": `${r(-15, 15)}deg`,
  };
}

export default function WelcomeScreen({ onContinue }) {
  const { t } = useTranslation();

  // Valores aleatorios fijos por sesión (useMemo sin deps = solo al montar)
  const [starts] = useState(() => [
    getRandomLetterStart(),
    getRandomLetterStart(),
    getRandomLetterStart(),
  ]);

  return (
    <div className="welcome-screen" aria-label={t("welcome.screenAria")}>
      <button
        type="button"
        className="welcome-screen__branding"
        onClick={onContinue}
        aria-label={t("welcome.continueAria")}
      >
        <div className="welcome-screen__letters" aria-hidden="true">
          <span className="welcome-screen__letter welcome-screen__letter--m-left" style={starts[0]}>m</span>
          <span className="welcome-screen__letter welcome-screen__letter--m-right" style={starts[1]}>m</span>
          <span className="welcome-screen__letter welcome-screen__letter--e" style={starts[2]}>e</span>
        </div>
        <span className="welcome-screen__subtitle">{t("welcome.subtitle")}</span>
      </button>
    </div>
  );
}
