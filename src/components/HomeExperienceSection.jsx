import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getExperience } from "../services/profileApi";
import WheelPicker from "./UI/WheelPicker";

/**
 * Sección de experiencia para la Home.
 * Muestra empresa, rol, fechas y responsabilidades con WheelPicker 3D.
 * Los elementos con [data-reveal] se animan al entrar en el viewport.
 */
export default function HomeExperienceSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({ queryKey: ["experience"], queryFn: getExperience });
  const containerRef = useRef(null);

  // Scroll-reveal: añade .is-visible cuando el elemento entra en el viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [data]);

  if (isLoading || !data?.length) return null;

  // Resuelve textos traducidos desde las claves i18n del JSON
  const getJobDisplay = (job) => ({
    role: job.roleKey ? t(job.roleKey) : job.role,
    company: job.company,
    responsibilities: job.responsibilityKey
      ? t(job.responsibilityKey, { returnObjects: true })
      : job.responsibilities || []
  });

  return (
    <div ref={containerRef} className="home-exp">

      {data.map((job, jobIdx) => {
        const display = getJobDisplay(job);
        return (
          <div key={job.id} className="home-exp__job">
            {/* Izquierda: empresa, rol, fechas — alineado arriba */}
            <div
              className="home-exp__job-info"
              data-reveal
              style={{ "--delay": `${jobIdx * 0.08}s` }}
            >
              <div className="home-exp__meta">
                <span className="home-exp__dates">{job.startDate}</span>
                <span className="home-exp__sep">–</span>
                {(job.endDate === t("home.endDatePresentEs") || job.endDate === t("home.endDatePresentEn"))
                  ? <span className="home-exp__state">{t("home.present")}</span>
                  : <span className="home-exp__dates">{job.endDate}</span>
                }
              </div>
              <h2 className="home-exp__company">{job.company}</h2>
              <p className="home-exp__role">{display.role}</p>
            </div>

            {/* Derecha: rueda de responsabilidades — alineada arriba */}
            <div className="home-exp__job-wheel">
              <WheelPicker items={display.responsibilities} ariaLabel={t("home.wheelPickerResponsibilitiesAria")} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
