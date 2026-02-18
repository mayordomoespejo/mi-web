import { memo, useCallback, useRef, useState, useEffect } from "react";

const SNAP_THRESHOLD = 0.4;

/**
 * Draggable pocket wrapper for education cards.
 * Cards start collapsed (hidden behind a vertical slit), showing only
 * a tab label (E/001). Drag left to reveal, right to hide.
 *
 * Slider layout: [tab][content] — tab is the pull handle on the left.
 * When collapsed the slider is pushed right so the tab sits at the slit line.
 */
const EducationPocket = memo(function EducationPocket({ index, children }) {
  const pocketRef = useRef(null);
  const sliderRef = useRef(null);
  const dragRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [collapsedOffset, setCollapsedOffset] = useState(0);

  const label = `E/${String(index + 1).padStart(3, "0")}`;

  // collapsed offset = pocket width − actionsInnerWidth (slit from left edge)
  useEffect(() => {
    const pocket = pocketRef.current;
    if (!pocket) return;

    const measure = () => {
      const pocketW = pocket.getBoundingClientRect().width;
      const actionsW = parseFloat(
        getComputedStyle(pocket).getPropertyValue("--actions-inner-width")
      );
      if (!actionsW || actionsW >= pocketW) return;
      // Tab (48px) sits just LEFT of the slit, so subtract its width
      setCollapsedOffset(Math.max(0, pocketW - actionsW - 48));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pocket);
    // Also observe the slider — its width depends on --actions-inner-width,
    // so it resizes when the wavebar actions change (language switch, etc.)
    if (sliderRef.current) ro.observe(sliderRef.current);
    return () => ro.disconnect();
  }, []);

  const getTargetX = useCallback(
    (isExp) => (isExp ? 0 : collapsedOffset),
    [collapsedOffset]
  );

  // --- Pointer-event drag (same pattern as TalkPanel) ---

  const handlePointerDown = useCallback(
    (e) => {
      const slider = sliderRef.current;
      if (!slider) return;

      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);

      dragRef.current = {
        startX: e.clientX,
        startOffset: getTargetX(expanded),
        moved: false
      };

      slider.style.transition = "none";
    },
    [expanded, getTargetX]
  );

  const handlePointerMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      const slider = sliderRef.current;
      if (!drag || !slider) return;

      drag.moved = true;
      const deltaX = e.clientX - drag.startX;
      const raw = drag.startOffset + deltaX;
      const clamped = Math.max(0, Math.min(collapsedOffset, raw));
      slider.style.transform = `translateX(${clamped}px)`;
    },
    [collapsedOffset]
  );

  const handlePointerUp = useCallback(() => {
    const drag = dragRef.current;
    const slider = sliderRef.current;
    if (!drag || !slider) return;

    dragRef.current = null;

    if (!drag.moved) {
      const next = !expanded;
      slider.style.transition = "";
      slider.style.transform = `translateX(${getTargetX(next)}px)`;
      setExpanded(next);
      return;
    }

    const currentX = new DOMMatrix(getComputedStyle(slider).transform).m41;
    const progress = collapsedOffset > 0 ? currentX / collapsedOffset : 0;
    const shouldExpand = progress < 1 - SNAP_THRESHOLD;

    slider.style.transition = "";
    slider.style.transform = `translateX(${getTargetX(shouldExpand)}px)`;
    setExpanded(shouldExpand);
  }, [expanded, collapsedOffset, getTargetX]);

  return (
    <div ref={pocketRef} className="education-pocket">
      <div
        ref={sliderRef}
        className="education-pocket__slider"
        style={{ transform: `translateX(${getTargetX(expanded)}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="education-pocket__tab">
          <span className="education-pocket__label">{label}</span>
        </div>
        <div className="education-pocket__content">{children}</div>
      </div>
    </div>
  );
});

export default EducationPocket;
