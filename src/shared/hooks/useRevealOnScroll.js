import { useEffect } from "react";

/**
 * Adds/removes a BEM modifier class on children marked with `[data-reveal]`
 * when they enter/leave the viewport via IntersectionObserver.
 *
 * @param {React.RefObject<HTMLElement>} containerRef - Ref to the scroll container.
 * @param {string} visibleClass - CSS class to toggle (e.g. "experience-job-card--visible").
 * @param {unknown} [dependency] - Extra dependency to re-create the observer (e.g. fetched data).
 */
export default function useRevealOnScroll(containerRef, visibleClass, dependency) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(visibleClass, entry.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: "-25% 0px -25% 0px" }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [containerRef, visibleClass, dependency]);
}
