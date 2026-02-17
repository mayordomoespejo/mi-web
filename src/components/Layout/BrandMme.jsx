import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Brand "mme": enlace a home con iniciales que al hover/focus despliegan
 * la palabra completa (m→iguel, m→ayordomo, e→spejo).
 * Acepta onClick opcional (p. ej. cerrar menú + scroll en navbar).
 */
export default function BrandMme({ onClick }) {
  const { t } = useTranslation();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  };

  const brandCells = [
    { letter: "m", word: t("common.brandNamePart1").toLowerCase() },
    { letter: "m", word: t("common.brandNamePart2").toLowerCase() },
    { letter: "e", word: t("common.brandNamePart3").toLowerCase() }
  ];

  return (
    <NavLink
      to="/"
      className="brand-mme"
      onClick={handleClick}
      aria-label={t("common.brandName").toLowerCase()}
    >
      {brandCells.map((cell, i) => (
        <span
          key={i}
          className={`brand-mme__cell ${cell.word ? "" : "brand-mme__cell--no-word"}`}
        >
          <span className="brand-mme__initial" aria-hidden="true">
            {cell.letter}
          </span>
          {cell.word && (
            <span className="brand-mme__word-wrap">
              <span className="brand-mme__word" aria-hidden="true">
                {cell.word}
              </span>
            </span>
          )}
        </span>
      ))}
    </NavLink>
  );
}
