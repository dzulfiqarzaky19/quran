import { HADITH_SOURCE } from "@/lib/hadith";

export const HadithSource = () => (
  <p className="mt-8 px-1 text-label-sm text-on-surface-variant">
    Source: hadith-api, {new URL(HADITH_SOURCE).hostname}
  </p>
);
