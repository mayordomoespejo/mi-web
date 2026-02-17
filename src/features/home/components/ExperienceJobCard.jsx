import { useTranslation } from "react-i18next";
import WheelPicker from "@/shared/components/ui/WheelPicker";

/**
 * Job card: dates, company, role and WheelPicker for responsibilities.
 * Root has [data-reveal]; parent ExperienceSection runs the IntersectionObserver.
 */
export default function ExperienceJobCard({ job, display, index = 0 }) {
  const { t } = useTranslation();

  const isPresent =
    job.endDate === t("home.endDatePresentEs") ||
    job.endDate === t("home.endDatePresentEn");

  return (
    <div className="experience-job-card" data-reveal style={{ "--delay": `${index * 0.08}s` }}>
      <div className="experience-job-card__info">
        <div className="experience-job-card__meta">
          <span className="experience-job-card__dates">{job.startDate}</span>
          <span className="experience-job-card__sep">–</span>
          {isPresent ? (
            <span className="experience-job-card__state">{t("home.present")}</span>
          ) : (
            <span className="experience-job-card__dates">{job.endDate}</span>
          )}
        </div>
        <h2 className="experience-job-card__company">{job.company}</h2>
        <p className="experience-job-card__role">{display.role}</p>
      </div>
      <div className="experience-job-card__wheel">
        <WheelPicker
          items={display.responsibilities}
          ariaLabel={t("home.wheelPickerResponsibilitiesAria")}
        />
      </div>
    </div>
  );
}
