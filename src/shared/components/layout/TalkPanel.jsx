import { forwardRef, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@/shared/components/ui/icons/ChevronRightIcon";
import { CONTACT_LINKS } from "@/core/constants";

const SNAP_THRESHOLD = 0.4;

/**
 * "Let's talk" panel: expands downward to reveal contact links.
 * Click or vertical drag from the icon corner to expand/collapse.
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

  /** Expanded height = natural body height with all its content. */
  const getExpandedHeight = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return 250;
    // With justify-content: flex-end the overflow goes upward (negative),
    // so scrollHeight doesn't measure it. Temporarily set height: auto.
    const prev = body.style.height;
    const prevTransition = body.style.transition;
    body.style.transition = "none";
    body.style.height = "auto";
    const natural = body.offsetHeight;
    body.style.height = prev;
    body.style.transition = prevTransition;
    // Force reflow to prevent flicker
    void body.offsetHeight;
    return natural;
  }, []);

  const toggle = useCallback(() => {
    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!body || !wrapper) return;

    const from = body.offsetHeight;
    const to = isExpanded ? wrapper.offsetHeight : getExpandedHeight();

    // Lock current height in px, disable transition to set the start point
    body.style.transition = "none";
    body.style.height = `${from}px`;
    // Force reflow so the browser registers the start point
    void body.offsetHeight;
    // Re-enable transition and animate to target
    body.style.transition = "";
    body.style.height = `${to}px`;

    setIsExpanded(!isExpanded);
  }, [isExpanded, getExpandedHeight]);

  // --- Drag handlers (vertical only) ---

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
      moved: false
    };

    body.style.transition = "none";
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
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
    },
    [getExpandedHeight]
  );

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

    // Re-enable transition and animate to target
    body.style.transition = "";
    body.style.height = `${shouldExpand ? maxH : minH}px`;

    setIsExpanded(shouldExpand);
  }, [toggle, getExpandedHeight]);

  const wrapperStyle = widthPx != null ? { width: `${widthPx}px` } : undefined;
  const experienceClass = isExperienceAtPanel ? " talk-panel--experience" : "";
  const expandedClass = isExpanded ? " talk-panel__body--expanded" : "";

  return (
    <div ref={setRef} className={`talk-panel${experienceClass}`} style={wrapperStyle}>
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

        {/* Contact links */}
        <nav
          className="talk-panel__contacts"
          aria-label={t("contact.title")}
          onClick={(e) => e.stopPropagation()}
        >
          <a href={CONTACT_LINKS.phone}>{t("contact.phone")}</a>
          <a href={CONTACT_LINKS.email}>{t("contact.email")}</a>
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
