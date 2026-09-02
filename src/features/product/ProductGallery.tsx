"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import Image from "next/image";
import { galleryFor } from "@/data/productAssets";
import { defaultProduct } from "@/data/products";
import type { TeeColorId } from "@/data/teeColors";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { cn } from "@/shared/utils/cn";
import type { Brainrototo } from "@/models";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(value * 100) / 100));
}

export function ProductGallery({
  brainrot,
  color,
}: {
  brainrot: Brainrototo;
  color: TeeColorId;
}) {
  const shots = galleryFor(brainrot, color);
  const [shotIndex, setShotIndex] = useState(0);
  const shot = shots[shotIndex] ?? null;
  const [zoomOpen, setZoomOpen] = useState(false);
  const canNav = shots.length > 1;

  const step = useCallback(
    (delta: number) => {
      if (shots.length < 2) return;
      setShotIndex((index) => (index + delta + shots.length) % shots.length);
    },
    [shots.length],
  );

  useEffect(() => {
    setShotIndex(0);
  }, [color, brainrot.id]);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomOpen(false);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomOpen, step]);

  return (
    <div className="min-w-0 max-w-full">
      <div className="group relative mx-auto aspect-square w-full min-w-0 max-w-full overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-sticker-sm">
        <span data-cart-fly className="absolute inset-0 min-h-0 min-w-0">
          {shot ? (
            <Image
              src={shot}
              alt={brainrot.name}
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-contain object-center"
              priority
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-white p-4 sm:p-8">
              <TeeMockup
                product={defaultProduct}
                brainrot={brainrot}
                color={color}
                className="max-h-full max-w-[22rem]"
              />
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="absolute inset-0 min-h-0 min-w-0 max-h-full max-w-full"
          aria-label="Agrandir le visuel"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-pill border-[3px] border-ink bg-white shadow-sticker-sm lg:opacity-0 lg:transition-opacity lg:duration-[var(--duration-micro)] lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
        >
          <ZoomIcon />
        </span>
      </div>

      {canNav ? (
        <ul className="mt-3 flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {shots.map((src, index) => {
            const selected = shotIndex === index;
            return (
              <li
                key={src}
                className="w-[4.75rem] min-w-[4.75rem] max-w-[4.75rem] shrink-0 sm:w-[5.5rem] sm:min-w-[5.5rem] sm:max-w-[5.5rem]"
              >
                <button
                  type="button"
                  onClick={() => setShotIndex(index)}
                  aria-label={`Vue ${index + 1} sur ${shots.length}`}
                  aria-pressed={selected}
                  className={cn(
                    "relative block aspect-square w-full min-w-0 max-w-full overflow-hidden rounded-lg border-[3px]",
                    selected
                      ? "border-ink shadow-sticker-sm"
                      : "border-ink/20 opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="88px"
                    className="object-contain"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {zoomOpen ? (
        <div
          className="fixed inset-0 z-50 bg-ink/80"
          role="dialog"
          aria-modal="true"
          aria-label="Zoom visuel"
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-3 top-3 z-20 rounded-pill border-[3px] border-ink bg-white px-3 py-1.5 font-display text-xs font-bold uppercase shadow-sticker-sm sm:right-5 sm:top-5"
          >
            Fermer
          </button>
          {canNav ? (
            <>
              <button
                type="button"
                aria-label="Vue précédente"
                onClick={() => step(-1)}
                className="absolute left-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-lg font-bold shadow-sticker-sm sm:left-4 sm:h-11 sm:w-11"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Vue suivante"
                onClick={() => step(1)}
                className="absolute right-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-lg font-bold shadow-sticker-sm sm:right-4 sm:h-11 sm:w-11"
              >
                →
              </button>
            </>
          ) : null}
          <ZoomStage resetKey={shot ?? `mockup-${brainrot.id}-${color}`}>
            {shot ? (
              <Image
                src={shot}
                alt={brainrot.name}
                width={1400}
                height={1400}
                sizes="90vw"
                draggable={false}
                className="max-h-[90dvh] w-auto max-w-full select-none object-contain"
              />
            ) : (
              <TeeMockup
                product={defaultProduct}
                brainrot={brainrot}
                color={color}
                className="max-h-[90dvh] max-w-[min(100%,36rem)]"
              />
            )}
          </ZoomStage>
        </div>
      ) : null}
    </div>
  );
}

function ZoomStage({
  resetKey,
  children,
}: {
  resetKey: string;
  children: ReactNode;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);

  const applyScale = useCallback((next: number) => {
    const value = clampScale(next);
    scaleRef.current = value;
    setScale(value);
    if (value <= MIN_SCALE) {
      panRef.current = { x: 0, y: 0 };
      setPan({ x: 0, y: 0 });
    }
  }, []);

  useEffect(() => {
    scaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, [resetKey]);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const direction = event.deltaY > 0 ? -0.4 : 0.4;
      applyScale(scaleRef.current + direction);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyScale]);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const onTouchMove = (event: globalThis.TouchEvent) => {
      if (event.touches.length < 2 || !pinchRef.current) return;
      event.preventDefault();
      const distance = pinchDistance(event.touches[0], event.touches[1]);
      applyScale(pinchRef.current.scale * (distance / pinchRef.current.distance));
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [applyScale]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        applyScale(scaleRef.current + 0.5);
      }
      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        applyScale(scaleRef.current - 0.5);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyScale]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || pinchRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
      moved: false,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || pinchRef.current) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (scaleRef.current <= MIN_SCALE || !drag.moved) return;
    const next = {
      x: drag.panX + dx,
      y: drag.panY + dy,
    };
    panRef.current = next;
    setPan(next);
  }

  function endDrag(toggle: boolean) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!toggle || !drag || drag.moved || pinchRef.current) return;
    applyScale(scaleRef.current > 1 ? 1 : 2.4);
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length === 2) {
      dragRef.current = null;
      pinchRef.current = {
        distance: pinchDistance(event.touches[0], event.touches[1]),
        scale: scaleRef.current,
      };
    }
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length < 2) pinchRef.current = null;
  }

  const zoomed = scale > MIN_SCALE;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute left-3 top-3 z-20 flex gap-1.5 sm:left-5 sm:top-5"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Zoom arrière"
          disabled={scale <= MIN_SCALE}
          onClick={() => applyScale(scale - 0.5)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-lg font-bold shadow-sticker-sm disabled:opacity-40"
        >
          −
        </button>
        <button
          type="button"
          aria-label="Zoom avant"
          disabled={scale >= MAX_SCALE}
          onClick={() => applyScale(scale + 0.5)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-lg font-bold shadow-sticker-sm disabled:opacity-40"
        >
          +
        </button>
      </div>
      <div
        ref={surfaceRef}
        className="flex h-full w-full touch-none items-center justify-center p-3 sm:px-16 sm:py-10"
        style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => endDrag(true)}
        onPointerCancel={() => endDrag(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div
          className="will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function pinchDistance(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number },
) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="2.4" />
      <path
        d="m15 15 5 5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
