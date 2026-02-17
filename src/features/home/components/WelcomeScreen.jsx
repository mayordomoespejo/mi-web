import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { WELCOME_CLOSE_DELAY_MS } from "@/core/constants";

const BRAND_LETTERS = ["m", "m", "e"];

export default function WelcomeScreen({ onContinue }) {
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isClosing) return;
    const timer = setTimeout(onContinue, WELCOME_CLOSE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isClosing, onContinue]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
  };

  return (
    <div
      className={`welcome-screen${isClosing ? " welcome-screen--closing" : ""}`}
      aria-label={t("welcome.screenAria")}
    >
      <button
        type="button"
        className="welcome-screen__branding"
        onClick={handleClose}
        disabled={isClosing}
        aria-label={t("welcome.continueAria")}
      >
        <div className="welcome-screen__letters" aria-hidden="true">
          {BRAND_LETTERS.map((letter, index) => (
            <span key={`${letter}-${index}`} className="welcome-screen__letter">
              {letter}
            </span>
          ))}
        </div>
        <span className="welcome-screen__subtitle">{t("welcome.subtitle")}</span>
      </button>
    </div>
  );
}
