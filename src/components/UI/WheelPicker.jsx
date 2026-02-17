import { useRef, useState, useEffect } from "react";

const STEP_ANGLE = 30;  // grados entre ítems
const RADIUS     = 120; // radio del cilindro en px
const ITEM_H     = 44;  // altura de cada ítem en px (coincide con SCSS)
const THROTTLE   = 170; // ms mínimos entre pasos de la rueda

/**
 * Wheel Picker – simulación 2D de rueda cilíndrica.
 *
 * IMPORTANTE: No usamos transforms 3D (translateZ, rotateX, perspective) porque
 * el ancestro .home-exp tiene mask-image:fixed, que crea un compositor layer y
 * aplana cualquier transform 3D de sus descendientes.
 *
 * El efecto de cilindro se simula con:
 *   - translateY → posición vertical en el arco del cilindro
 *   - scaleY     → compresión vertical que imita la perspectiva (ítems más lejanos parecen más planos)
 *   - opacity    → desvanecimiento con la distancia al ítem activo
 */
/**
 * @param {string[]} items - Lista de textos a mostrar en la rueda.
 * @param {string} [ariaLabel] - Etiqueta de accesibilidad para el listbox (p. ej. "Responsabilidades").
 */
export default function WheelPicker({ items, ariaLabel }) {
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef(null);
  const indexRef   = useRef(0);
  const lastTime   = useRef(0);

  useEffect(() => { indexRef.current = index; }, [index]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const dir   = e.deltaY > 0 ? 1 : -1;
      const idx   = indexRef.current;
      const total = items.length;

      if (dir === 1 && idx >= total - 1) return; // límite inferior → ceder scroll
      if (dir === -1 && idx <= 0)        return; // límite superior → ceder scroll

      e.preventDefault();

      const now = Date.now();
      if (now - lastTime.current < THROTTLE) return;
      lastTime.current = now;

      setIndex(p => Math.max(0, Math.min(total - 1, p + dir)));
    };

    const onKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setIndex(p => Math.min(items.length - 1, p + 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setIndex(p => Math.max(0, p - 1)); }
    };

    el.addEventListener("wheel",   onWheel, { passive: false });
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel",   onWheel);
      el.removeEventListener("keydown", onKey);
    };
  }, [items.length]);

  if (!items?.length) return null;

  return (
    <div ref={wrapperRef} className="wheel-picker" tabIndex={0} role="listbox" aria-label={ariaLabel}>
      {items.map((item, i) => {
        const offset  = i - index;
        const rad     = (offset * STEP_ANGLE * Math.PI) / 180;

        // Posición Y en el arco del cilindro (sin 3D)
        const y       = RADIUS * Math.sin(rad);
        // scaleY imita la compresión de perspectiva: ítems en los extremos parecen más planos
        const scaleY  = Math.max(0.05, Math.cos(rad));
        // Opacidad decae con la distancia al activo
        const opacity = Math.max(0, Math.cos(rad));

        return (
          <div
            key={i}
            className="wheel-picker__item"
            role="option"
            aria-selected={i === index}
            style={{
              transform: `translateY(${y - ITEM_H / 2}px) scaleY(${scaleY})`,
              opacity,
            }}
          >
            <span className="wheel-picker__bullet" aria-hidden="true">›</span>
            {item}
          </div>
        );
      })}

      <div className="wheel-picker__fade wheel-picker__fade--top"    aria-hidden="true" />
      <div className="wheel-picker__fade wheel-picker__fade--bottom" aria-hidden="true" />
      <div className="wheel-picker__selector" aria-hidden="true" />
    </div>
  );
}
