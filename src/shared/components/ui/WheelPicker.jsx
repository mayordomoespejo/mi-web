import { useRef, useState, useEffect, useCallback } from "react";
import {
  WHEEL_PICKER_STEP_ANGLE,
  WHEEL_PICKER_RADIUS,
  WHEEL_PICKER_ITEM_HEIGHT
} from "@/core/constants";
import ChevronRightIcon from "@/shared/components/ui/icons/ChevronRightIcon";

// ─── Physics constants ───────────────────────────────────────────────────────
const FRICTION = 0.94; // per-frame multiplier (lower = more friction)
const MIN_VELOCITY = 0.15; // below this, snap to nearest item
const SNAP_STIFFNESS = 0.15; // spring towards nearest item
const SNAP_DAMPING = 0.7; // damping on the snap spring
const DRAG_SENSITIVITY = 0.02; // px dragged → position units
const VELOCITY_SAMPLES = 5; // recent samples for release velocity
const SCROLL_THRESHOLD = 10; // min deltaY to trigger a step

/**
 * Wheel Picker – infinite physics-based cylindrical wheel.
 * Supports drag (mouse/touch), mouse-wheel and keyboard.
 * Momentum + friction + snap-to-item for a natural spin feel.
 */
export default function WheelPicker({ items, ariaLabel }) {
  const total = items?.length || 0;

  // position is a continuous float; Math.round(position) = active index
  const pos = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef(null);
  const isSnapping = useRef(false);
  const isDragging = useRef(false);
  const dragSamples = useRef([]); // { pos, time } for velocity estimation
  const scrollTarget = useRef(0); // target index for scroll-wheel input

  const wrapperRef = useRef(null);
  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender((n) => n + 1), []);

  // ─── Animation loop ──────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (isDragging.current) {
      rafId.current = requestAnimationFrame(tick);
      return;
    }

    if (isSnapping.current) {
      // Spring towards scrollTarget
      const delta = scrollTarget.current - pos.current;
      velocity.current += delta * SNAP_STIFFNESS;
      velocity.current *= SNAP_DAMPING;
      pos.current += velocity.current;

      if (Math.abs(delta) < 0.005 && Math.abs(velocity.current) < 0.005) {
        pos.current = scrollTarget.current;
        velocity.current = 0;
        isSnapping.current = false;
        rerender();
        rafId.current = null;
        return; // stop loop
      }
    } else {
      // Free momentum with friction
      velocity.current *= FRICTION;
      pos.current += velocity.current;

      if (Math.abs(velocity.current) < MIN_VELOCITY) {
        velocity.current = 0;
        scrollTarget.current = Math.round(pos.current);
        isSnapping.current = true;
      }
    }

    rerender();
    rafId.current = requestAnimationFrame(tick);
  }, [rerender]);

  const startLoop = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(tick);
  }, [tick]);

  const stopLoop = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  // ─── Drag helpers ────────────────────────────────────────────────────────
  const onDragStart = useCallback(
    (clientY) => {
      stopLoop();
      isDragging.current = true;
      velocity.current = 0;
      isSnapping.current = false;
      scrollTarget.current = Math.round(pos.current);
      dragSamples.current = [{ pos: pos.current, time: performance.now() }];
      wrapperRef.current._lastY = clientY;
    },
    [stopLoop]
  );

  const onDragMove = useCallback(
    (clientY) => {
      if (!isDragging.current) return;
      const dy = clientY - wrapperRef.current._lastY;
      wrapperRef.current._lastY = clientY;
      pos.current -= dy * DRAG_SENSITIVITY;

      const now = performance.now();
      dragSamples.current.push({ pos: pos.current, time: now });
      if (dragSamples.current.length > VELOCITY_SAMPLES) dragSamples.current.shift();

      rerender();
    },
    [rerender]
  );

  const onDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Estimate release velocity from recent samples
    const samples = dragSamples.current;
    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = (last.time - first.time) / 1000; // seconds
      if (dt > 0) {
        velocity.current = ((last.pos - first.pos) / dt) * 0.06;
      }
    }

    startLoop();
  }, [startLoop]);

  // ─── Event bindings ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || !total) return;

    // Mouse drag
    const onMouseDown = (e) => {
      e.preventDefault();
      onDragStart(e.clientY);
      const onMove = (ev) => onDragMove(ev.clientY);
      const onUp = () => {
        onDragEnd();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };

    // Touch drag
    const onTouchStart = (e) => {
      onDragStart(e.touches[0].clientY);
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      onDragMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => onDragEnd();

    // Mouse wheel scroll – step one item at a time with snap animation
    const onWheel = (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;
      const direction = e.deltaY > 0 ? 1 : -1;
      stopLoop();
      velocity.current = 0;
      scrollTarget.current = Math.round(pos.current) + direction;
      isSnapping.current = true;
      startLoop();
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      stopLoop();
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [total, onDragStart, onDragMove, onDragEnd, startLoop, stopLoop]);

  if (!total) return null;

  // ─── Render ──────────────────────────────────────────────────────────────
  const currentPos = pos.current;
  const currentVel = velocity.current;
  const nearestIndex = Math.round(currentPos);
  const fractional = currentPos - nearestIndex; // -0.5 … +0.5

  // Arrow wobble: sawtooth from fractional position, amplitude from velocity
  // sin(frac * 2π) peaks between items → the arrow gets "pushed" at each edge
  const speed = Math.abs(currentVel);
  const wobbleBase = Math.sin(currentPos * Math.PI * 2);
  const wobbleAmplitude = Math.min(45, speed * 25 + Math.abs(fractional) * 30);
  const arrowRotation = wobbleBase * wobbleAmplitude;

  const visibleRange = 4;
  const visibleItems = [];
  for (let offset = -visibleRange; offset <= visibleRange; offset++) {
    const rawIndex = nearestIndex + offset;
    const itemIndex = ((rawIndex % total) + total) % total;
    const displayOffset = offset - fractional;
    visibleItems.push({ itemIndex, displayOffset });
  }

  return (
    <div
      ref={wrapperRef}
      className="wheel-picker"
      tabIndex={0}
      role="listbox"
      aria-label={ariaLabel}
    >
      {visibleItems.map(({ itemIndex, displayOffset }, i) => {
        const rad = (displayOffset * WHEEL_PICKER_STEP_ANGLE * Math.PI) / 180;
        const y = WHEEL_PICKER_RADIUS * Math.sin(rad);
        const scaleY = Math.max(0.05, Math.cos(rad));
        const opacity = Math.max(0, Math.cos(rad));

        return (
          <div
            key={`${nearestIndex}-${i}`}
            className="wheel-picker__item"
            role="option"
            aria-selected={displayOffset === 0}
            style={{
              transform: `translateY(${y - WHEEL_PICKER_ITEM_HEIGHT / 2}px) scaleY(${scaleY})`,
              opacity
            }}
          >
            {items[itemIndex]}
          </div>
        );
      })}

      <span
        className="wheel-picker__arrow"
        aria-hidden="true"
        style={{ transform: `translateY(-50%) rotate(${arrowRotation}deg)` }}
      >
        <ChevronRightIcon />
      </span>

      <div className="wheel-picker__fade wheel-picker__fade--top" aria-hidden="true" />
      <div className="wheel-picker__fade wheel-picker__fade--bottom" aria-hidden="true" />
      <div className="wheel-picker__selector" aria-hidden="true" />
    </div>
  );
}
