// Rules follow Peraturan Menteri Agama No. 52/2014 (gold: Pasal 4, money: Pasal 8)
// and the BAZNAS income nisab, which BAZNAS re-issues every year.

export const NISAB_GOLD_GRAMS = 85;
export const ZAKAT_RATE = 0.025;

/** SK Ketua BAZNAS No. 15/2026, in rupiah. */
export const INCOME_NISAB = {
  year: 2026,
  monthly: 7_640_144,
  yearly: 91_681_728,
};

export interface ZakatInputs {
  /** Rupiah per gram. */
  goldPrice: number;
  /** Grams held for a full Hijri year. */
  goldGrams: number;
  /** Rupiah held for a full Hijri year. */
  savings: number;
  monthlyIncome: number;
  /** Rupiah per month. */
  incomeNisab: number;
}

export interface ZakatLine {
  /** Rupiah the zakat is taken from. */
  base: number;
  /** In rupiah; null while it cannot be worked out without a gold price. */
  nisab: number | null;
  due: boolean;
  zakat: number;
}

export interface ZakatResult {
  /** Per year. */
  gold: ZakatLine;
  /** Per year. */
  savings: ZakatLine;
  /** Per month. */
  income: ZakatLine;
  yearlyTotal: number;
}

function line(base: number, nisab: number | null, due: boolean): ZakatLine {
  return { base, nisab, due, zakat: due ? base * ZAKAT_RATE : 0 };
}

/**
 * Gold and money each have their own 85 gram nisab and are not added together.
 * Once the nisab is reached, zakat is 2.5% of the whole amount, not the excess.
 */
export function calculateZakat(inputs: ZakatInputs): ZakatResult {
  const { goldPrice, goldGrams, savings, monthlyIncome, incomeNisab } = inputs;
  const goldNisab = goldPrice > 0 ? NISAB_GOLD_GRAMS * goldPrice : null;

  const gold = line(goldGrams * goldPrice, goldNisab, goldGrams >= NISAB_GOLD_GRAMS);
  const savingsLine = line(savings, goldNisab, goldNisab !== null && savings >= goldNisab);
  const income = line(
    monthlyIncome,
    incomeNisab,
    monthlyIncome > 0 && monthlyIncome >= incomeNisab,
  );

  return {
    gold,
    savings: savingsLine,
    income,
    yearlyTotal: gold.zakat + savingsLine.zakat + income.zakat * 12,
  };
}
