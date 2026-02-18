import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Brand "mme": initials that expand/collapse to the full word on click.
 * Not a navigation link.
 * @param {Object} props
 * @param {((e: React.MouseEvent) => void)|undefined} props.onClick - Optional callback on click.
 */
export default function BrandMme({ onClick }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e) => {
    setIsExpanded((prev) => !prev);
    if (onClick) onClick(e);
  };

  const brandCells = [
    { letter: "m", word: t("common.brandNamePart1").toLowerCase() },
    { letter: "m", word: t("common.brandNamePart2").toLowerCase() },
    { letter: "e", word: t("common.brandNamePart3").toLowerCase() }
  ];

  return (
    <button
      type="button"
      className={`brand-mme${isExpanded ? " brand-mme--expanded" : ""}`}
      onClick={handleClick}
      aria-label={t("common.brandName").toLowerCase()}
      aria-expanded={isExpanded}
    >
      {brandCells.map((cell, i) => (
        <span
          key={`${cell.letter}-${i}`}
          className={`brand-mme__cell${cell.word ? "" : " brand-mme__cell--no-word"}`}
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
    </button>
  );
}
