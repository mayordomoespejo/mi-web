import { useEffect, useRef } from "react";

/**
 * Measures header sub-elements and exposes their heights as CSS custom
 * properties on the layout root element:
 *   --layout-header-height, --layout-wavebar-height, --layout-panel-height
 *
 * Uses a single ResizeObserver that auto-disconnects on unmount.
 *
 * @param {React.RefObject<HTMLElement>} layoutRef - Ref to the layout root.
 * @returns {{ headerRef, wavebarRef, panelRef }} Refs to attach to each element.
 */
export default function useLayoutHeights(layoutRef) {
  const headerRef = useRef(null);
  const wavebarRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const layout = layoutRef?.current;
    if (!layout) return;

    const setHeights = () => {
      if (headerRef.current)
        layout.style.setProperty(
          "--layout-header-height",
          `${headerRef.current.offsetHeight}px`
        );
      if (wavebarRef.current)
        layout.style.setProperty(
          "--layout-wavebar-height",
          `${wavebarRef.current.offsetHeight}px`
        );
      if (panelRef.current)
        layout.style.setProperty(
          "--layout-panel-height",
          `${panelRef.current.offsetHeight}px`
        );
    };

    setHeights();
    const ro = new ResizeObserver(setHeights);
    if (headerRef.current) ro.observe(headerRef.current);
    if (wavebarRef.current) ro.observe(wavebarRef.current);
    if (panelRef.current) ro.observe(panelRef.current);
    return () => ro.disconnect();
  }, [layoutRef]);

  return { headerRef, wavebarRef, panelRef };
}
