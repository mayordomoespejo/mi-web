import { useRef, useState, useEffect } from "react";
import {
  WHEEL_PICKER_THROTTLE_MS,
  WHEEL_PICKER_STEP_ANGLE,
  WHEEL_PICKER_RADIUS,
  WHEEL_PICKER_ITEM_HEIGHT
} from "@/core/constants";

/**
 * Wheel Picker – 2D cylindrical wheel. Uses translateY/scaleY/opacity (no 3D)
 * so it works inside ancestors with mask-image or similar. Items: list of strings; ariaLabel for listbox.
 */
export default function WheelPicker({ items, ariaLabel }) {
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef(null);
  const indexRef = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const dir = e.deltaY > 0 ? 1 : -1;
      const idx = indexRef.current;
      const total = items.length;

      if (dir === 1 && idx >= total - 1) return; // límite inferior → ceder scroll
      if (dir === -1 && idx <= 0) return; // límite superior → ceder scroll

      e.preventDefault();

      const now = Date.now();
      if (now - lastTime.current < WHEEL_PICKER_THROTTLE_MS) return;
      lastTime.current = now;

      setIndex((p) => Math.max(0, Math.min(total - 1, p + dir)));
    };

    const onKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((p) => Math.min(items.length - 1, p + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((p) => Math.max(0, p - 1));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("keydown", onKey);
    };
  }, [items.length]);

  if (!items?.length) return null;

  return (
    <div
      ref={wrapperRef}
      className="wheel-picker"
      tabIndex={0}
      role="listbox"
      aria-label={ariaLabel}
    >
      {items.map((item, i) => {
        const offset = i - index;
        const rad = (offset * WHEEL_PICKER_STEP_ANGLE * Math.PI) / 180;
        const y = WHEEL_PICKER_RADIUS * Math.sin(rad);
        const scaleY = Math.max(0.05, Math.cos(rad));
        const opacity = Math.max(0, Math.cos(rad));

        return (
          <div
            key={i}
            className="wheel-picker__item"
            role="option"
            aria-selected={i === index}
            style={{
              transform: `translateY(${y - WHEEL_PICKER_ITEM_HEIGHT / 2}px) scaleY(${scaleY})`,
              opacity
            }}
          >
            <span className="wheel-picker__bullet" aria-hidden="true">
              ›
            </span>
            {item}
          </div>
        );
      })}

      <div className="wheel-picker__fade wheel-picker__fade--top" aria-hidden="true" />
      <div className="wheel-picker__fade wheel-picker__fade--bottom" aria-hidden="true" />
      <div className="wheel-picker__selector" aria-hidden="true" />
    </div>
  );
}
