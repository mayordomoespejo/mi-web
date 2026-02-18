import { forwardRef, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@/shared/components/ui/icons/ChevronRightIcon";

const EXPANDED_MAX_WIDTH = 400;
const EXPANDED_MAX_HEIGHT = 300;
const SNAP_THRESHOLD = 0.4;

function getExpandedSize() {
  return {
    width: Math.min(EXPANDED_MAX_WIDTH, window.innerWidth * 0.5),
    height: Math.min(EXPANDED_MAX_HEIGHT, window.innerHeight * 0.5),
  };
}

/**
 * Panel "Hablemos": esquina superior derecha anclada.
 * Click o drag desde la esquina del icono para expandir/colapsar.
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

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // --- Drag handlers (on the arrow drag-handle) ---

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!body || !wrapper) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = body.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
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

    const deltaX = e.clientX - drag.startX;
    const deltaY = e.clientY - drag.startY;

    const expanded = getExpandedSize();
    const minW = wrapper.offsetWidth;
    const minH = wrapper.offsetHeight;

    // Arrastrar a la izquierda aumenta el ancho; arrastrar abajo aumenta el alto
    const newW = Math.max(minW, Math.min(expanded.width, drag.startWidth - deltaX));
    const newH = Math.max(minH, Math.min(expanded.height, drag.startHeight + deltaY));

    body.style.width = `${newW}px`;
    body.style.height = `${newH}px`;
  }, []);

  const handlePointerUp = useCallback((e) => {
    const drag = dragRef.current;
    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!drag || !body || !wrapper) return;

    dragRef.current = null;

    // Sin movimiento → es un click, toggle
    if (!drag.moved) {
      body.style.transition = "";
      body.style.width = "";
      body.style.height = "";
      setIsExpanded((prev) => !prev);
      return;
    }

    // Calcular progreso para decidir snap
    const currentW = body.offsetWidth;
    const currentH = body.offsetHeight;

    const expanded = getExpandedSize();
    const minW = wrapper.offsetWidth;
    const minH = wrapper.offsetHeight;

    const rangeW = expanded.width - minW || 1;
    const rangeH = expanded.height - minH || 1;
    const progress = Math.max(
      (currentW - minW) / rangeW,
      (currentH - minH) / rangeH
    );
    const shouldExpand = progress > SNAP_THRESHOLD;

    // Mantener tamaño actual inline y re-activar transiciones
    body.style.width = `${currentW}px`;
    body.style.height = `${currentH}px`;
    body.style.transition = "";

    setIsExpanded(shouldExpand);

    // Doble rAF para que React aplique la clase antes de quitar los inline styles
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!bodyRef.current) return;
        bodyRef.current.style.width = "";
        bodyRef.current.style.height = "";
      });
    });
  }, []);

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
        {/* Drag handle: zona amplia en la esquina del icono */}
        <div
          className="talk-panel__drag-handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={(e) => e.stopPropagation()}
        >
          <ChevronRightIcon className="talk-panel__arrow" />
        </div>
        <span className="talk-panel__text">{talkText}</span>
      </div>
    </div>
  );
});

export default TalkPanel;
