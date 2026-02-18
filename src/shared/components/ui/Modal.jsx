import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Button from "./Button";

export default function Modal({ isOpen, onClose, title, children }) {
  const titleId = useId();
  const closeButtonRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal__overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="modal__header">
          <h3 id={titleId}>{title}</h3>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            onClick={onClose}
            aria-label={t("modal.close")}
          >
            ✕
          </Button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
