import { Fragment, useCallback, useMemo, useState } from "react";

function wrapWordsInSpans(segment, keyPrefix, wordIndexRef, readUpToIndex, onWordEnter) {
  if (!segment || typeof segment !== "string") return [];

  return segment.split(/(\s+)/).map((part, index) => {
    if (/^\s+$/.test(part)) return part;

    const wordIndex = wordIndexRef.current++;
    const readClassName = wordIndex <= readUpToIndex ? " home-bio--read" : "";

    return (
      <span
        key={`${keyPrefix}-${index}`}
        className={`home-bio__word${readClassName}`}
        onMouseEnter={() => onWordEnter?.(wordIndex)}
      >
        {part}
      </span>
    );
  });
}

function renderHighlightedBio(text, phrases, readUpToIndex, onWordEnter) {
  if (!text || !Array.isArray(phrases) || phrases.length === 0) return null;

  const escapedPhrases = phrases.map((phrase) => phrase.replace(/\s+/g, "\\s+"));
  const regex = new RegExp(`(${escapedPhrases.join("|")})`, "gi");
  const segments = text.split(regex);
  const wordIndexRef = { current: 0 };
  let keyPrefix = 0;

  return segments.map((segment, segmentIndex) => {
    const isHighlighted = phrases.some(
      (phrase) => phrase.toLowerCase() === segment.toLowerCase()
    );

    if (!isHighlighted) {
      return (
        <Fragment key={segmentIndex}>
          {wrapWordsInSpans(
            segment,
            keyPrefix++,
            wordIndexRef,
            readUpToIndex,
            onWordEnter
          )}
        </Fragment>
      );
    }

    const wordIndex = wordIndexRef.current++;
    const readClassName = wordIndex <= readUpToIndex ? " home-bio--read" : "";

    return (
      <span
        key={segmentIndex}
        className={`home-bio__word home-bio__word--highlight${readClassName}`}
        onMouseEnter={() => onWordEnter?.(wordIndex)}
      >
        {segment}
      </span>
    );
  });
}

export default function BioKaraoke({ text, phrases }) {
  const [readUpToIndex, setReadUpToIndex] = useState(-1);

  const handleWordEnter = useCallback((index) => {
    setReadUpToIndex(index);
  }, []);

  const handleReset = useCallback(() => {
    setReadUpToIndex(-1);
  }, []);

  const renderedBio = useMemo(
    () => renderHighlightedBio(text, phrases, readUpToIndex, handleWordEnter),
    [text, phrases, readUpToIndex, handleWordEnter]
  );

  return (
    <p
      className="home-bio"
      onClick={handleReset}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleReset();
      }}
      role="button"
      tabIndex={0}
    >
      {renderedBio}
    </p>
  );
}
