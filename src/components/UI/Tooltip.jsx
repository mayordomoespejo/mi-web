import { useId, useState } from "react";

export default function Tooltip({ label, children }) {
  const id = useId();
  const [visible, setVisible] = useState(false);

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
        aria-label="Información"
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
