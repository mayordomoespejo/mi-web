import { forwardRef, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@/shared/components/ui/icons/ChevronRightIcon";
import { CONTACT_LINKS } from "@/core/constants";

const SNAP_THRESHOLD = 0.4;

/**
 * Panel "Hablemos": se despliega solo hacia abajo mostrando contactos.
 * Click o drag vertical desde la esquina del icono para expandir/colapsar.
 */
const TalkPanel = forwardRef(function TalkPanel(
  { widthPx = null, isExperienceAtPanel = false },
  ref
) {
  const { t } = useTranslation();
  const talkText = t("home.talk");
  const [isExpanded, setIsExpanded] = useState(false);
  const wrapperRef = useRef(null);
  const bodyRef = useRef(null);
  const dragRef = useRef(null);

  const setRef = useCallback(
    (node) => {
      wrapperRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  /** Altura expandida = altura natural del body con todo su contenido */
  const getExpandedHeight = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return 250;
    // Con justify-content: flex-end el overflow es negativo (arriba),
    // así que scrollHeight no lo mide. Medimos con height: auto temporalmente.
    const prev = body.style.height;
    const prevTransition = body.style.transition;
    body.style.transition = "none";
    body.style.height = "auto";
    const natural = body.offsetHeight;
    body.style.height = prev;
    body.style.transition = prevTransition;
    // Forzar reflow para que no haya parpadeo
    void body.offsetHeight;
    return natural;
  }, []);

  const toggle = useCallback(() => {
    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!body || !wrapper) return;

    const from = body.offsetHeight;
    const to = isExpanded ? wrapper.offsetHeight : getExpandedHeight();

    // Fijar altura actual en px, desactivar transición para forzar el punto de partida
    body.style.transition = "none";
    body.style.height = `${from}px`;
    // Forzar reflow para que el navegador registre el punto de partida
    void body.offsetHeight;
    // Re-activar transición y animar al target
    body.style.transition = "";
    body.style.height = `${to}px`;

    setIsExpanded(!isExpanded);
  }, [isExpanded, getExpandedHeight]);

  // --- Drag handlers (solo vertical) ---

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!body || !wrapper) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    dragRef.current = {
      startY: e.clientY,
      startHeight: body.getBoundingClientRect().height,
      moved: false,
    };

    body.style.transition = "none";
  }, []);

  const handlePointerMove = useCallback((e) => {
    const drag = dragRef.current;
    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!drag || !body || !wrapper) return;

    drag.moved = true;

    const deltaY = e.clientY - drag.startY;
    const minH = wrapper.offsetHeight;
    const maxH = getExpandedHeight();
    const newH = Math.max(minH, Math.min(maxH, drag.startHeight + deltaY));

    body.style.height = `${newH}px`;
  }, [getExpandedHeight]);

  const handlePointerUp = useCallback(() => {
    const drag = dragRef.current;
    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!drag || !body || !wrapper) return;

    dragRef.current = null;

    if (!drag.moved) {
      body.style.transition = "";
      toggle();
      return;
    }

    const currentH = body.offsetHeight;
    const minH = wrapper.offsetHeight;
    const maxH = getExpandedHeight();
    const progress = (currentH - minH) / (maxH - minH || 1);
    const shouldExpand = progress > SNAP_THRESHOLD;

    // Re-activar transición y animar al target
    body.style.transition = "";
    body.style.height = `${shouldExpand ? maxH : minH}px`;

    setIsExpanded(shouldExpand);
  }, [toggle, getExpandedHeight]);

  const wrapperStyle = widthPx != null ? { width: `${widthPx}px` } : undefined;
  const experienceClass = isExperienceAtPanel ? " talk-panel--experience" : "";
  const expandedClass = isExpanded ? " talk-panel__body--expanded" : "";

  return (
    <div
      ref={setRef}
      className={`talk-panel${experienceClass}`}
      style={wrapperStyle}
    >
      <div
        ref={bodyRef}
        className={`talk-panel__body${expandedClass}`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? t("home.talkClose") : t("home.talkOpen")}
      >
        {/* Drag handle */}
        <div
          className="talk-panel__drag-handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={(e) => e.stopPropagation()}
        >
          <ChevronRightIcon className="talk-panel__arrow" />
        </div>

        {/* Contactos */}
        <nav
          className="talk-panel__contacts"
          aria-label={t("contact.title")}
          onClick={(e) => e.stopPropagation()}
        >
          <a href={CONTACT_LINKS.phone}>
            {t("contact.phone")}
          </a>
          <a href={CONTACT_LINKS.email}>
            {t("contact.email")}
          </a>
          <a href={CONTACT_LINKS.linkedin} target="_blank" rel="noreferrer">
            {t("contact.linkedin")}
          </a>
          <a href={CONTACT_LINKS.github} target="_blank" rel="noreferrer">
            {t("contact.github")}
          </a>
        </nav>

        <span className="talk-panel__text">{talkText}</span>
      </div>
    </div>
  );
});

export default TalkPanel;
