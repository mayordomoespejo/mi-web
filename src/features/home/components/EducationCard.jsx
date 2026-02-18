import { memo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Converts an education item id (kebab-case) to its i18n key (camelCase).
 * E.g. "daw-ilerna" → "dawIlerna", "bach-ricardo-ortega" → "bachRicardoOrtega"
 * @param {string} id - Item id from the education JSON.
 * @returns {string} Key for home.education[key].
 */
function idToI18nKey(id) {
  if (!id || typeof id !== "string") return "";
  return id
    .split("-")
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

/**
 * Education card with vertical carousel effect.
 * Each card is sticky and stacks on top of the previous one on scroll.
 *
 * @param {Object} item - Data: { id, title, center, dates }.
 * @param {number} index - 0-based index for the E/001, E/002 label.
 * @param {number} total - Total cards for z-index calculation.
 */
const EducationCard = memo(function EducationCard({ item, index, total }) {
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

  return (
    <article
      className="education-card"
      style={{
        "--card-index": index,
        "--card-total": total
      }}
    >
      <div className="education-card__header">
        <h2 className="education-card__title">{title}</h2>
      </div>
      <div className="education-card__separator" aria-hidden="true" />
      <div className="education-card__body">
        <p className="education-card__center">{center}</p>
        <p className="education-card__dates">{dates}</p>
      </div>
    </article>
  );
});

export default EducationCard;
