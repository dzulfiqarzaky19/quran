import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ZakatFields {
  goldPrice: number;
  goldGrams: number;
  savings: number;
  monthlyIncome: number;
  /** null follows the current BAZNAS figure, so a new year's value reaches people who never changed it. */
  incomeNisab: number | null;
}

interface ZakatState extends ZakatFields {
  setField: <K extends keyof ZakatFields>(field: K, value: ZakatFields[K]) => void;
  reset: () => void;
}

const EMPTY: ZakatFields = {
  goldPrice: 0,
  goldGrams: 0,
  savings: 0,
  monthlyIncome: 0,
  incomeNisab: null,
};

// Kept apart from useAppStore so only the calculator inputs are written to localStorage
export const useZakatStore = create<ZakatState>()(
  persist(
    (set) => ({
      ...EMPTY,
      setField: (field, value) => set({ [field]: value }),
      reset: () => set(EMPTY),
    }),
    { name: 'quran-zakat' },
  ),
);
