"use client";

import React, { useRef, useState, useCallback } from "react";
import baseStyles from "./DragSlider.module.css";

interface DragSliderProps {
  /** Current slider value on a 0–100 scale. */
  value: number;
  /** Called continuously during click, touch, drag, and keyboard adjustments (0–100). */
  onChange: (percent: number) => void;
  /** Optional callback fired when a drag gesture ends with the final value (0–100). */
  onChangeEnd?: (percent: number) => void;
  /** Accessible label for screen readers. */
  ariaLabel: string;
  /** Optional tooltip title. */
  title?: string;
  /** Keyboard step size in percentage points (defaults to 2). */
  step?: number;
  /** Optional extra CSS class for the track container. */
  trackClassName?: string;
  /** Optional extra CSS class for the filled progress bar. */
  fillClassName?: string;
  /** Optional extra CSS class for the draggable thumb handle. */
  thumbClassName?: string;
  /** Optional formatted value for aria-valuetext. */
  ariaValueText?: string;
}

function clampPercent(val: number): number {
  if (!Number.isFinite(val)) return 0;
  return Math.max(0, Math.min(100, val));
}

export default function DragSlider({
  value,
  onChange,
  onChangeEnd,
  ariaLabel,
  title,
  step = 2,
  trackClassName = "",
  fillClassName = "",
  thumbClassName,
  ariaValueText,
}: DragSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragValue, setDragValue] = useState<number | null>(null);

  const computePercentFromClientX = useCallback((clientX: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const ratio = (clientX - rect.left) / rect.width;
    return clampPercent(ratio * 100);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only respond to primary mouse button or touch/pen input
    if (e.pointerType === "mouse" && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    activePointerIdRef.current = e.pointerId;
    isDraggingRef.current = true;
    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable in this environment
    }

    const nextPercent = computePercentFromClientX(e.clientX);
    setDragValue(nextPercent);
    onChange(nextPercent);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || activePointerIdRef.current !== e.pointerId) {
      return;
    }

    const nextPercent = computePercentFromClientX(e.clientX);
    setDragValue(nextPercent);
    onChange(nextPercent);
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>, commitFinal: boolean) => {
    if (!isDraggingRef.current || activePointerIdRef.current !== e.pointerId) {
      return;
    }

    const finalPercent = computePercentFromClientX(e.clientX);
    isDraggingRef.current = false;
    activePointerIdRef.current = null;
    setIsDragging(false);
    setDragValue(null);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore if capture was already released
    }

    if (commitFinal) {
      onChange(finalPercent);
      onChangeEnd?.(finalPercent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const current = clampPercent(value);
    let next: number | null = null;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = clampPercent(current + step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = clampPercent(current - step);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      default:
        break;
    }

    if (next !== null) {
      e.preventDefault();
      onChange(next);
      onChangeEnd?.(next);
    }
  };

  const displayPercent = isDragging && dragValue !== null ? dragValue : clampPercent(value);

  return (
    <div
      ref={trackRef}
      className={`${baseStyles.sliderTrack} ${trackClassName}`.trim()}
      data-dragging={isDragging ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => finishDrag(e, true)}
      onPointerCancel={(e) => finishDrag(e, false)}
      onLostPointerCapture={(e) => finishDrag(e, false)}
      onKeyDown={handleKeyDown}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(displayPercent)}
      aria-valuetext={ariaValueText}
      title={title}
    >
      <div
        className={`${baseStyles.sliderFill} ${fillClassName}`.trim()}
        style={{ width: `${displayPercent}%` }}
      />
      {thumbClassName && (
        <div
          className={`${baseStyles.sliderThumb} ${thumbClassName}`.trim()}
          style={{ left: `${displayPercent}%` }}
        />
      )}
    </div>
  );
}

