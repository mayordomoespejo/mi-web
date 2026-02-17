import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WaveBars from "./WaveBars";
import SteppedPanel from "./SteppedPanel";
import Footer from "./Footer";

/**
 * Mide header, solo WaveBars y SteppedPanel. Expone:
 * - --site-header-height: altura total del hero (WaveBars + gap + SteppedPanel) para padding del main.
 * - --site-wavebar-height: solo la zona de WaveBars; las secciones usan esto en scroll-margin-top
 *   para quedar justo debajo de las barras (sin stepped panel ni gap).
 * - --site-stepped-panel-height: para min-height de las secciones home.
 */
function useShellHeights(shellRef) {
  const headerRef = useRef(null);
  const wavebarRef = useRef(null);
  const steppedPanelRef = useRef(null);

  useEffect(() => {
    const shell = shellRef?.current;
    if (!shell) return;

    const setHeights = () => {
      if (headerRef.current) {
        shell.style.setProperty("--site-header-height", `${headerRef.current.offsetHeight}px`);
      }
      if (wavebarRef.current) {
        shell.style.setProperty("--site-wavebar-height", `${wavebarRef.current.offsetHeight}px`);
      }
      if (steppedPanelRef.current) {
        shell.style.setProperty("--site-stepped-panel-height", `${steppedPanelRef.current.offsetHeight}px`);
      }
    };

    setHeights();
    const ro = new ResizeObserver(setHeights);
    if (headerRef.current) ro.observe(headerRef.current);
    if (wavebarRef.current) ro.observe(wavebarRef.current);
    if (steppedPanelRef.current) ro.observe(steppedPanelRef.current);
    return () => ro.disconnect();
  }, []);

  return { headerRef, wavebarRef, steppedPanelRef };
}

/**
 * Shell principal de la aplicación: barras de navegación, panel superior, contenido y pie.
 * @returns {JSX.Element}
 */
export default function Layout() {
  const shellRef = useRef(null);
  const { headerRef, wavebarRef, steppedPanelRef } = useShellHeights(shellRef);
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const [isExperienceActive, setIsExperienceActive] = useState(false);

  // Título de la pestaña según idioma (traducción meta.pageTitle)
  useEffect(() => {
    document.title = i18n.t("meta.pageTitle");
  }, [i18n.language, i18n]);

  // En home: WaveBars usa fondo secondary cuando la sección Experiencia está activa (visible bajo las barras)
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
      // Experiencia activa solo cuando la zona visible bajo las barras es esa sección
      // (no en Intro ni cuando ya hemos pasado a Educación)
      const isActive =
        rect.top <= wavebarHeight && rect.bottom > wavebarHeight;
      setIsExperienceActive(isActive);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  return (
    <div ref={shellRef} className="site-shell">
      <header ref={headerRef} className="site-hero">
        <div
          ref={wavebarRef}
          className={`site-hero__wavebar${isExperienceActive ? " site-hero__wavebar--experience" : ""}`}
        >
          <WaveBars />
        </div>
        <div ref={steppedPanelRef} className="container">
          <SteppedPanel />
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
