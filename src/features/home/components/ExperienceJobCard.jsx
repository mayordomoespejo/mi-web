import { useTranslation } from "react-i18next";
import WheelPicker from "@/shared/components/ui/WheelPicker";

/**
 * Tarjeta reutilizable para mostrar un trabajo/experiencia.
 * Muestra fechas, empresa, rol y un WheelPicker con responsabilidades.
 * El contenedor .home-exp__job tiene [data-reveal]; el padre debe tener el observer (reveal + reverso al scroll inverso).
 *
 * @param {Object} job - Datos del trabajo: id, startDate, endDate, company
 * @param {Object} display - Textos ya resueltos: role, company, responsibilities
 * @param {number} index - Índice del trabajo (para delay de animación)
 */
export default function ExperienceJobCard({ job, display, index = 0 }) {
  const { t } = useTranslation();

  const isPresent =
    job.endDate === t("home.endDatePresentEs") ||
    job.endDate === t("home.endDatePresentEn");

  return (
    <div className="home-exp__job" data-reveal style={{ "--delay": `${index * 0.08}s` }}>
      {/* Izquierda: empresa, rol, fechas — alineado arriba */}
      <div className="home-exp__job-info">
        <div className="home-exp__meta">
          <span className="home-exp__dates">{job.startDate}</span>
          <span className="home-exp__sep">–</span>
          {isPresent ? (
            <span className="home-exp__state">{t("home.present")}</span>
          ) : (
            <span className="home-exp__dates">{job.endDate}</span>
          )}
        </div>
        <h2 className="home-exp__company">{job.company}</h2>
        <p className="home-exp__role">{display.role}</p>
      </div>

      {/* Derecha: rueda de responsabilidades — alineada arriba */}
      <div className="home-exp__job-wheel">
        <WheelPicker
          items={display.responsibilities}
          ariaLabel={t("home.wheelPickerResponsibilitiesAria")}
        />
      </div>
    </div>
  );
}
