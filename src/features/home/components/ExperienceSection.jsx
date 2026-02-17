import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getExperience } from "@/services/profileApi";
import ExperienceJobCard from "./ExperienceJobCard";

/**
 * Sección de experiencia para la Home.
 * Muestra empresa, rol, fechas y responsabilidades con WheelPicker 3D.
 * Items with [data-reveal] animate in when entering view and out on reverse scroll.
 */
export default function ExperienceSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: getExperience
  });
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: "-25% 0px -25% 0px" }
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
    <div ref={containerRef} className="experience-section">
      {data.map((job, jobIdx) => {
        const display = getJobDisplay(job);
        return (
          <ExperienceJobCard key={job.id} job={job} display={display} index={jobIdx} />
        );
      })}
    </div>
  );
}
