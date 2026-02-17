import { useTranslation } from "react-i18next";

/**
 * Convierte el id del ítem de educación (kebab-case) a la clave i18n (camelCase).
 * Ej: "daw-ilerna" -> "dawIlerna", "bach-ricardo-ortega" -> "bachRicardoOrtega"
 * @param {string} id - Id del ítem (p. ej. del JSON de educación).
 * @returns {string} Clave para home.education[key].
 */
function idToI18nKey(id) {
  if (!id || typeof id !== "string") return "";
  return id
    .split("-")
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

/**
 * Card de formación. Con sticky=true (segunda card) se superpone a la anterior al hacer scroll (efecto wheel).
 *
 * @param {Object} item - Datos del ítem: { id, title, center, dates } (title/center/dates pueden venir del API; se sobrescriben con i18n si existen).
 * @param {number} index - Índice (0-based) para mostrar E/001, E/002.
 * @param {boolean} [sticky=false] - Si es true, la card se queda fija al hacer scroll (primera card).
 * @param {boolean} [stacksOnTop=false] - Si es true, la card tiene z-index mayor y hace scroll por encima de la sticky.
 */
export default function EducationCard({
  item,
  index,
  sticky = false,
  stacksOnTop = false
}) {
  const { t } = useTranslation();
  const i18nKey = idToI18nKey(item.id);
  const title = i18nKey
    ? t(`home.education.${i18nKey}.title`, { defaultValue: item.title })
    : item.title;
  const center = i18nKey
    ? t(`home.education.${i18nKey}.center`, { defaultValue: item.center })
    : item.center;
  const dates = i18nKey
    ? t(`home.education.${i18nKey}.dates`, { defaultValue: item.dates })
    : item.dates;

  const sequence = String(index + 1).padStart(3, "0");

  return (
    <article
      className={`education-card${sticky ? " education-card--sticky" : ""}${stacksOnTop ? " education-card--stacks-on-top" : ""}`}
    >
      <div className="education-card__header">
        <span className="education-card__id" aria-hidden="true">
          E/{sequence}
        </span>
        <h2 className="education-card__title">{title}</h2>
      </div>
      <div className="education-card__separator" aria-hidden="true" />
      {/* Cuerpo: centro, fechas y opcionalmente CTA */}
      <div className="education-card__body">
        <p className="education-card__center">{center}</p>
        <p className="education-card__dates">{dates}</p>
      </div>
    </article>
  );
}
