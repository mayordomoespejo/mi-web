import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WaveBars from "./WaveBars";
import SteppedPanel from "./SteppedPanel";
import Footer from "./Footer";

/** Exposes --layout-header-height, --layout-wavebar-height, --layout-panel-height for sections/scroll. */
function useLayoutHeights(layoutRef) {
  const headerRef = useRef(null);
  const wavebarRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const layout = layoutRef?.current;
    if (!layout) return;

    const setHeights = () => {
      if (headerRef.current) layout.style.setProperty("--layout-header-height", `${headerRef.current.offsetHeight}px`);
      if (wavebarRef.current) layout.style.setProperty("--layout-wavebar-height", `${wavebarRef.current.offsetHeight}px`);
      if (panelRef.current) layout.style.setProperty("--layout-panel-height", `${panelRef.current.offsetHeight}px`);
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

export default function Layout() {
  const layoutRef = useRef(null);
  const { headerRef, wavebarRef, panelRef } = useLayoutHeights(layoutRef);
  const { i18n, t } = useTranslation();
  const { pathname } = useLocation();
  const [isExperienceActive, setIsExperienceActive] = useState(false);
  const [actionsInnerWidthPx, setActionsInnerWidthPx] = useState(null);

  useEffect(() => {
    document.title = i18n.t("meta.pageTitle");
  }, [i18n.language, i18n]);

  useEffect(() => {
    if (pathname !== "/") {
      setIsExperienceActive(false);
      return;
    }
    const experienceEl = document.getElementById("home-experience");
    const wavebarEl = wavebarRef.current;
    if (!experienceEl || !wavebarEl) return;

    const check = () => {
      const wavebarHeight = wavebarEl.offsetHeight;
      const rect = experienceEl.getBoundingClientRect();
      setIsExperienceActive(rect.top <= wavebarHeight && rect.bottom > wavebarHeight);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname, wavebarRef]);

  return (
    <div ref={layoutRef} className="layout">
      <header ref={headerRef} className="layout__header">
        <div
          ref={wavebarRef}
          className={`layout__wavebar${isExperienceActive ? " layout__wavebar--experience" : ""}`}
        >
          <WaveBars onActionsInnerWidthChange={setActionsInnerWidthPx} />
        </div>
        <div ref={panelRef} className="container layout__panel-row">
          <SteppedPanel />
          <div
            className="talk-panel"
            style={actionsInnerWidthPx != null ? { width: `${actionsInnerWidthPx}px` } : undefined}
          >
            <span className="talk-panel__text">{t("home.talk")}</span>
          </div>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
