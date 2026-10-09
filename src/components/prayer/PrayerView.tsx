"use client";

import { useNow } from '@/hooks/useNow';
import {
  DEFAULT_METHOD,
  getPrayerSchedule,
  getQiblaBearing,
  isCalculationMethodId,
} from '@/lib/prayer';
import { usePrayerStore } from '@/store/prayer';
import { NextPrayer } from './NextPrayer';
import { PrayerSettings } from './PrayerSettings';
import { PrayerTimesList } from './PrayerTimesList';
import { QiblaCompass } from './QiblaCompass';

export function PrayerView() {
  const now = useNow();
  const location = usePrayerStore((state) => state.location);
  const setLocation = usePrayerStore((state) => state.setLocation);
  const storedMethod = usePrayerStore((state) => state.method);
  const setMethod = usePrayerStore((state) => state.setMethod);

  // The clock and the persisted settings only exist in the browser
  if (!now) {
    return (
      <div className="mx-auto flex w-full max-w-xl animate-pulse flex-col gap-10">
        <div className="mx-3 h-32 rounded-xl bg-surface-container-low" />
        <div className="flex flex-col gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-surface-container-low" />
          ))}
        </div>
      </div>
    );
  }

  // A method saved by an older build may no longer exist
  const method = isCalculationMethodId(storedMethod) ? storedMethod : DEFAULT_METHOD;
  const settings = (
    <PrayerSettings
      location={location}
      onLocationChange={setLocation}
      method={method}
      onMethodChange={setMethod}
    />
  );

  if (!location) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
        <div className="px-3">
          <h1 className="text-title-lg font-bold tracking-tight">Prayer times</h1>
          <p className="mt-2 text-body-lg text-on-surface-variant">
            Times and the Qibla direction are calculated on this device from your position. Share
            it with the button, or pick a city.
          </p>
        </div>
        {settings}
      </div>
    );
  }

  const schedule = getPrayerSchedule(location, now, method);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
      <NextPrayer next={schedule.next} now={now} timeZone={location.timeZone} />
      <PrayerTimesList schedule={schedule} timeZone={location.timeZone} />
      <QiblaCompass bearing={getQiblaBearing(location)} />
      {settings}
    </div>
  );
}
