import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import BioKaraoke from "../components/BioKaraoke";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";

const SESSION_STORAGE_SCROLL_KEY = "scrollToSection";
export default function HomePage() {
  const { t } = useTranslation();
  const phrases = t("home.bioHighlightPhrases", { returnObjects: true });
  const bio = t("home.bio");

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
      <section className="home-page home-page__intro" id="home-intro">
        <div className="container home-page__intro-inner">
          {bio ? <BioKaraoke text={bio} phrases={phrases} /> : null}
        </div>
      </section>

      <section id="home-experience" className="home-page home-page__experience">
        <div className="container home-page__experience-inner">
          <ExperienceSection />
        </div>
      </section>

      <section id="home-education" className="home-page home-page__education">
        <div className="container home-page__education-inner">
          <EducationSection />
        </div>
      </section>
    </>
  );
}
