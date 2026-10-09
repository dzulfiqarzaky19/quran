"use client";

import { useEffect, useState } from 'react';
import { Navigation2 } from 'lucide-react';
import { compassPoint } from '@/lib/prayer';

interface QiblaCompassProps {
  /** Degrees clockwise from true north */
  bearing: number;
}

const FACING_TOLERANCE = 5;

// Only absolute events are earth-referenced; alpha counts counter-clockwise from north
const useCompassHeading = (): number | null => {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (!event.absolute || event.alpha === null) return;
      setHeading(Math.round(360 - event.alpha) % 360);
    };

    window.addEventListener('deviceorientationabsolute', onOrientation);
    return () => window.removeEventListener('deviceorientationabsolute', onOrientation);
  }, []);

  return heading;
};

export function QiblaCompass({ bearing }: QiblaCompassProps) {
  const heading = useCompassHeading();
  const rounded = Math.round(bearing) % 360;
  const offset = heading === null ? null : ((rounded - heading + 540) % 360) - 180;
  const isFacing = offset !== null && Math.abs(offset) <= FACING_TOLERANCE;

  return (
    <section aria-labelledby="qibla-label" className="rounded-2xl bg-surface-container-low p-6">
      <h2
        id="qibla-label"
        className="text-label-sm uppercase tracking-[0.05em] text-on-surface-variant"
      >
        Qibla
      </h2>

      <div className="mt-2 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-display-lg font-bold tabular-nums">
            {rounded}°
          </p>
          <p
            aria-live="polite"
            className={`mt-1 text-body-sm ${isFacing ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
          >
            {offset === null
              ? `${compassPoint(rounded)}, clockwise from true north`
              : isFacing
                ? 'Facing the Qibla'
                : `Turn ${Math.abs(offset)}° ${offset > 0 ? 'right' : 'left'}`}
          </p>
        </div>

        {/* The dial turns against the device so N stays on north; the needle is fixed to the dial */}
        <div
          aria-hidden="true"
          className="relative h-28 w-28 shrink-0 rounded-full bg-surface-container-lowest transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ transform: `rotate(${-(heading ?? 0)}deg)` }}
        >
          <span className="absolute left-1/2 top-1.5 -translate-x-1/2 text-label-sm font-semibold text-on-surface-variant">
            N
          </span>
          <div
            className="absolute inset-0 flex items-start justify-center pt-5"
            style={{ transform: `rotate(${rounded}deg)` }}
          >
            <Navigation2 className="h-7 w-7 fill-primary text-primary" />
          </div>
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-surface-variant" />
        </div>
      </div>

      {heading === null && (
        <p className="mt-4 text-body-sm text-on-surface-variant">
          The dial shows north at the top. On a phone with a compass sensor it follows the device.
        </p>
      )}
    </section>
  );
}
