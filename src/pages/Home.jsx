import { Fragment, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import HomeExperienceSection from "../components/HomeExperienceSection";

const SESSION_STORAGE_SCROLL_KEY = "scrollToSection";

/**
 * Envuelve un segmento en spans por palabra; asigna índice y clase --read; al pasar el ratón notifica para efecto karaoke.
 * @param {string} segment - Trozo de texto.
 * @param {number} keyPrefix - Prefijo para keys.
 * @param {{ current: number }} wordIndexRef - Referencia al índice de palabra actual.
 * @param {number} readUpToIndex - Hasta qué índice (inclusive) se considera leído.
 * @param {(index: number) => void} [onWordEnter] - Se llama al entrar con el ratón en una palabra (recibe su índice).
 * @returns {Array<string|JSX.Element>}
 */
function wrapWordsInSpans(segment, keyPrefix, wordIndexRef, readUpToIndex, onWordEnter) {
  if (!segment || typeof segment !== "string") return [];
  const parts = segment.split(/(\s+)/);
  return parts.map((part, j) => {
    if (/^\s+$/.test(part)) return part;
    const index = wordIndexRef.current++;
    const isRead = index <= readUpToIndex;
    const readClass = isRead ? " home__profile-bio-word--read" : "";
    return (
      <span
        key={`${keyPrefix}-${j}`}
        className={`home__profile-bio-word${readClass}`}
        onMouseEnter={() => onWordEnter?.(index)}
      >
        {part}
      </span>
    );
  });
}

/**
 * Divide la bio en segmentos, resalta frases y marca palabras como "leídas" hasta readUpToIndex (karaoke con el ratón).
 * @param {string} text - Texto de la biografía.
 * @param {string[]} phrases - Frases a resaltar.
 * @param {number} readUpToIndex - Índice hasta el cual las palabras se marcan como leídas (-1 = ninguna).
 * @param {(index: number) => void} [onWordEnter] - Se llama al entrar con el ratón en una palabra.
 * @returns {Array<string|JSX.Element>|null}
 */
function highlightBio(text, phrases, readUpToIndex = -1, onWordEnter) {
  if (!text || typeof text !== "string" || !Array.isArray(phrases) || phrases.length === 0) return null;
  const escaped = phrases.map((p) => p.replace(/\s+/g, "\\s+"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const segments = text.split(regex);
  const wordIndexRef = { current: 0 };
  let keyIndex = 0;
  return segments.map((segment, i) => {
    const isHighlight = phrases.some(
      (p) => p.toLowerCase() === segment.toLowerCase()
    );
    if (isHighlight) {
      const index = wordIndexRef.current++;
      const isRead = index <= readUpToIndex;
      const readClass = isRead ? " home__profile-bio-word--read" : "";
      return (
        <span
          key={i}
          className={`home__profile-bio-highlight home__profile-bio-word${readClass}`}
          onMouseEnter={() => onWordEnter?.(index)}
        >
          {segment}
        </span>
      );
    }
    return (
      <Fragment key={i}>
        {wrapWordsInSpans(segment, keyIndex++, wordIndexRef, readUpToIndex, onWordEnter)}
      </Fragment>
    );
  });
}

/**
 * Página de inicio: muestra la biografía del perfil desde la API con frases resaltadas.
 * Efecto karaoke: al pasar el ratón, las palabras por las que ha pasado quedan marcadas como leídas.
 * @returns {JSX.Element}
 */
export default function Home() {
  const { t } = useTranslation();

  const phrases = t("home.bioHighlightPhrases", { returnObjects: true });
  const bio = t("home.bio");

  const [readUpToIndex, setReadUpToIndex] = useState(-1);

  // Al entrar el ratón en una palabra, el "leído hasta" sigue al cursor (ir atrás desmarca)
  const handleWordEnter = useCallback((index) => {
    setReadUpToIndex(index);
  }, []);

  // Clic en el párrafo: quitar todas las marcas
  const handleBioClick = useCallback(() => {
    setReadUpToIndex(-1);
  }, []);

  // Si llegamos desde WaveBars (otra ruta) con una sección a la que ir, hacemos scroll tras montar
  useEffect(() => {
    const sectionId = sessionStorage.getItem(SESSION_STORAGE_SCROLL_KEY);
    if (!sectionId) return;
    sessionStorage.removeItem(SESSION_STORAGE_SCROLL_KEY);
    const el = document.getElementById(sectionId);
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {/* Sección 1: intro — alto disponible = viewport − header */}
      <section className="home home__intro" id="home-intro">
        <div className="container home__intro-inner">
          {bio && (
            <p className="home__profile-bio" onClick={handleBioClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleBioClick()}>
              {highlightBio(bio, phrases, readUpToIndex, handleWordEnter)}
            </p>
          )}
        </div>
      </section>

      {/* Sección 2: experiencia — alto disponible = viewport − header */}
      <section id="home-experience" className="home home__experience">
        <div className="container home__experience-inner">
          <HomeExperienceSection />
        </div>
      </section>

      {/* Sección 3: educación — alto disponible = viewport − header */}
      <section id="home-education" className="home home__education">
        <div className="container home__education-inner">
          {/* Contenido educación (placeholder) */}
        </div>
      </section>
    </>
  );
}
