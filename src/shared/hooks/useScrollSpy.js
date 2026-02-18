import { useEffect, useState } from "react";

/**
 * Detects whether a target element is visible at specific vertical positions
 * within the viewport using IntersectionObserver. Replaces expensive scroll
 * listeners + `document.elementsFromPoint()` with a single passive observer.
 *
 * Returns two booleans:
 *   - isAtWavebar:   the target overlaps the wavebar area (top of viewport)
 *   - isAtTalkPanel: the target reaches the panel area (below the header)
 *
 * @param {string}  targetId  - DOM id of the element to observe (e.g. "home-experience").
 * @param {string}  pathname  - Current route pathname; observation only runs on "/".
 * @param {React.RefObject<HTMLElement>} wavebarRef  - Ref to the wavebar element.
 * @param {React.RefObject<HTMLElement>} talkPanelRef - Ref to the talk-panel element.
 */
export default function useScrollSpy(targetId, pathname, wavebarRef, talkPanelRef) {
  const [isAtWavebar, setIsAtWavebar] = useState(false);
  const [isAtTalkPanel, setIsAtTalkPanel] = useState(false);

  // Observer for wavebar overlap (top of viewport)
  useEffect(() => {
    if (pathname !== "/") {
      setIsAtWavebar(false);
      return;
    }

    const target = document.getElementById(targetId);
    const wavebarEl = wavebarRef.current;
    if (!target || !wavebarEl) return;

    const update = () => {
      const wavebarHeight = wavebarEl.offsetHeight;
      // Negative bottom margin shrinks the observed area to only the wavebar zone
      const rootMargin = `0px 0px -${window.innerHeight - wavebarHeight}px 0px`;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsAtWavebar(entry.isIntersecting);
        },
        { threshold: 0, rootMargin }
      );

      observer.observe(target);
      return observer;
    };

    let observer = update();

    // Recreate on resize since rootMargin is static per observer
    const onResize = () => {
      observer?.disconnect();
      observer = update();
    };

    window.addEventListener("resize", onResize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [targetId, pathname, wavebarRef]);

  // Observer for talk-panel overlap (below the header)
  useEffect(() => {
    if (pathname !== "/") {
      setIsAtTalkPanel(false);
      return;
    }

    const target = document.getElementById(targetId);
    const talkPanelEl = talkPanelRef.current;
    if (!target || !talkPanelEl) return;

    const update = () => {
      const panelBottom = talkPanelEl.getBoundingClientRect().bottom;
      // Shrink viewport to check just below the panel
      const rootMargin = `-${panelBottom}px 0px -${window.innerHeight - panelBottom - 1}px 0px`;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsAtTalkPanel(entry.isIntersecting);
        },
        { threshold: 0, rootMargin }
      );

      observer.observe(target);
      return observer;
    };

    let observer = update();

    const onResize = () => {
      observer?.disconnect();
      observer = update();
    };

    window.addEventListener("resize", onResize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [targetId, pathname, talkPanelRef]);

  return { isAtWavebar, isAtTalkPanel };
}
