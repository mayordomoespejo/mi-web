import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getExperience } from "@/services/profileApi";
import ExperienceJobCard from "./ExperienceJobCard";

/**
 * Sección de experiencia para la Home.
 * Muestra empresa, rol, fechas y responsabilidades con WheelPicker 3D.
 * Los elementos con [data-reveal] se animan al entrar en la zona central y se ocultan al salir (scroll inverso).
 */
export default function ExperienceSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: getExperience
  });
  const containerRef = useRef(null);

  // Scroll-reveal: aparece poco antes de llegar a su posición (zona central); desaparece al hacer scroll inverso.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-25% 0px -25% 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [data]);

  if (isLoading || !data?.length) return null;

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
          <ExperienceJobCard key={job.id} job={job} display={display} index={jobIdx} />
        );
      })}
    </div>
  );
}
