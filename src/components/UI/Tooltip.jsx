import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Tooltip({ label, children }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <span
      className="tooltip"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <button
        type="button"
        className="tooltip__trigger"
        aria-describedby={id}
        aria-label={t("tooltip.info")}
      >
        {children}
      </button>
      <span
        id={id}
        role="tooltip"
        className={`tooltip__content ${visible ? "is-visible" : ""}`}
      >
        {label}
      </span>
    </span>
  );
}
