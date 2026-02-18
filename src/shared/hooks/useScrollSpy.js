import { useEffect, useState, useCallback } from "react";

const getSectionAtWavebar = (sectionIds, intersections) => {
  for (let i = sectionIds.length - 1; i >= 0; i -= 1) {
    const sectionId = sectionIds[i];
    if (intersections[sectionId]) {
      return sectionId;
    }
  }

  return null;
};

/**
 * Detects which section is in the wavebar zone and whether the talk-panel target is at the panel.
 * Uses IntersectionObserver per section so adding new sections only requires updating the config.
 *
 * Returns:
 *   - sectionAtWavebar: id of the section currently in the wavebar zone (last in DOM order when
 *     several intersect), or null. Used to decide wavebar color (e.g. only experience gets a special style).
 *   - isAtTalkPanel: true when talkPanelTargetId element reaches the panel area.
 *
 * @param {string[]} wavebarSectionIds - Section ids in DOM order (e.g. ["home-intro", "home-experience", "home-education"]).
 * @param {string}  talkPanelTargetId - DOM id used for panel overlap (e.g. "home-experience").
 * @param {string}  pathname - Current route; observation only runs on "/".
 * @param {React.RefObject<HTMLElement>} wavebarRef - Ref to the wavebar element.
 * @param {React.RefObject<HTMLElement>} talkPanelRef - Ref to the talk-panel element.
 */
export default function useScrollSpy(
  wavebarSectionIds,
  talkPanelTargetId,
  pathname,
  wavebarRef,
  talkPanelRef
) {
  const [wavebarIntersections, setWavebarIntersections] = useState(() => ({}));
  const [isAtTalkPanel, setIsAtTalkPanel] = useState(false);

  const sectionAtWavebar = getSectionAtWavebar(wavebarSectionIds, wavebarIntersections);

  const setSectionAtWavebar = useCallback((sectionId, isIntersecting) => {
    setWavebarIntersections((prev) =>
      prev[sectionId] === isIntersecting ? prev : { ...prev, [sectionId]: isIntersecting }
    );
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setWavebarIntersections({});
      return;
    }

    const wavebarEl = wavebarRef.current;
    if (!wavebarEl) return;

    const observers = [];
    const disconnect = () => {
      observers.forEach((o) => o?.disconnect());
      observers.length = 0;
    };

    const setup = () => {
      disconnect();
      const wavebarHeight = wavebarEl.offsetHeight;
      const rootMargin = `0px 0px -${window.innerHeight - wavebarHeight}px 0px`;

      wavebarSectionIds.forEach((sectionId) => {
        const target = document.getElementById(sectionId);
        if (!target) return;

        const observer = new IntersectionObserver(
          ([entry]) => setSectionAtWavebar(sectionId, entry.isIntersecting),
          { threshold: 0, rootMargin }
        );
        observer.observe(target);
        observers.push(observer);
      });

      return observers;
    };

    setup();

    const onResize = () => {
      disconnect();
      setup();
    };
    window.addEventListener("resize", onResize);
    return () => {
      disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [pathname, wavebarRef, wavebarSectionIds, setSectionAtWavebar]);

  // Observer for talk-panel overlap (below the header)
  useEffect(() => {
    if (pathname !== "/") {
      setIsAtTalkPanel(false);
      return;
    }

    const target = document.getElementById(talkPanelTargetId);
    const talkPanelEl = talkPanelRef.current;
    if (!target || !talkPanelEl) return;

    const update = () => {
      const panelBottom = talkPanelEl.getBoundingClientRect().bottom;
      const rootMargin = `-${panelBottom}px 0px -${window.innerHeight - panelBottom - 1}px 0px`;

      const observer = new IntersectionObserver(
        ([entry]) => setIsAtTalkPanel(entry.isIntersecting),
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
  }, [talkPanelTargetId, pathname, talkPanelRef]);

  return { sectionAtWavebar, isAtTalkPanel };
}
