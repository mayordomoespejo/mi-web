import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getExperience } from "@/services/profileApi";
import { useRevealOnScroll } from "@/shared/hooks";
import ExperienceJobCard from "./ExperienceJobCard";

/**
 * Experience section for the Home page.
 * Displays company, role, dates and responsibilities with a 3D WheelPicker.
 * Items with [data-reveal] animate in/out via IntersectionObserver.
 */
export default function ExperienceSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: getExperience
  });
  const containerRef = useRef(null);

  useRevealOnScroll(containerRef, "experience-job-card--visible", data);

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
