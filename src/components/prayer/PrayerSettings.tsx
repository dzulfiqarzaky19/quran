"use client";

import { useState } from 'react';
import { LocateFixed } from 'lucide-react';
import {
  CALCULATION_METHODS,
  CITIES,
  CalculationMethodId,
  PrayerLocation,
  isCalculationMethodId,
} from '@/lib/prayer';

interface PrayerSettingsProps {
  location: PrayerLocation | null;
  onLocationChange: (location: PrayerLocation) => void;
  method: CalculationMethodId;
  onMethodChange: (method: CalculationMethodId) => void;
}

const DEVICE_LABEL = 'Current location';

const GEOLOCATION_ERRORS: Record<number, string> = {
  1: 'Location permission was denied. Pick a city instead.',
  2: 'Your position is unavailable right now. Pick a city instead.',
  3: 'Finding your position took too long. Try again or pick a city.',
};

const fieldLabel = 'mb-2 block text-label-sm uppercase tracking-[0.05em] text-on-surface-variant';
const select =
  'h-12 w-full cursor-pointer rounded-xl border border-outline-variant/15 bg-surface-container-highest px-3 text-body-lg text-on-surface transition-colors focus:border-primary/40 focus:outline-none';

export function PrayerSettings({
  location,
  onLocationChange,
  method,
  onMethodChange,
}: PrayerSettingsProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setError('This browser cannot share a position. Pick a city instead.');
      return;
    }

    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLocating(false);
        onLocationChange({
          label: DEVICE_LABEL,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      (positionError) => {
        setIsLocating(false);
        setError(GEOLOCATION_ERRORS[positionError.code] ?? 'Could not find your position.');
      },
      { timeout: 10000, maximumAge: 600000 },
    );
  };

  const selectedCity = CITIES.find((city) => city.label === location?.label)?.label ?? '';

  return (
    <section aria-labelledby="prayer-settings-label" className="flex flex-col gap-6 px-3">
      <h2 id="prayer-settings-label" className="sr-only">
        Location and method
      </h2>

      <div>
        <label htmlFor="prayer-city" className={fieldLabel}>
          Location
        </label>
        <div className="flex gap-2">
          <select
            id="prayer-city"
            value={selectedCity}
            onChange={(event) => {
              const city = CITIES.find((c) => c.label === event.target.value);
              if (!city) return;
              setError(null);
              onLocationChange(city);
            }}
            className={select}
          >
            <option value="" disabled>
              {location?.label === DEVICE_LABEL ? DEVICE_LABEL : 'Pick a city'}
            </option>
            {CITIES.map((city) => (
              <option key={city.label} value={city.label}>
                {city.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={locate}
            disabled={isLocating}
            aria-label="Use my location"
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-surface-container-high text-on-surface transition-transform hover:text-primary active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
          >
            <LocateFixed className={`h-5 w-5 ${isLocating ? 'animate-pulse' : ''}`} />
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-body-sm text-on-surface-variant">
            {error}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="prayer-method" className={fieldLabel}>
          Calculation method
        </label>
        <select
          id="prayer-method"
          value={method}
          onChange={(event) => {
            if (isCalculationMethodId(event.target.value)) onMethodChange(event.target.value);
          }}
          className={select}
        >
          {Object.entries(CALCULATION_METHODS).map(([id, { label }]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
