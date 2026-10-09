"use client";

import { useId } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { useZakatStore } from "@/store/zakat";
import { INCOME_NISAB, NISAB_GOLD_GRAMS, ZakatLine, calculateZakat } from "@/lib/zakat";

const field =
  "h-11 w-full rounded-xl bg-surface-container-high px-3 text-body-md font-semibold tabular-nums text-on-surface";
const fieldLabel = "flex flex-col gap-1 text-label-sm text-on-surface-variant";
const hint = "text-body-sm text-on-surface-variant";

const rupiah = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const formatRupiah = (value: number) => `Rp ${rupiah.format(Math.round(value))}`;

interface RupiahFieldProps {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

// Shows thousands separators while typing; a number input cannot
const RupiahField = ({ label, value, disabled, onChange }: RupiahFieldProps) => (
  <label className={fieldLabel}>
    {label}
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      disabled={disabled}
      placeholder="0"
      value={value > 0 ? rupiah.format(value) : ""}
      onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "").slice(0, 15)))}
      className={field}
    />
  </label>
);

interface ResultRowProps {
  label: string;
  period: string;
  line: ZakatLine;
  /** Shown instead of the amount while the line cannot be worked out. */
  missing?: string;
}

const ResultRow = ({ label, period, line, missing }: ResultRowProps) => (
  <div className="flex items-baseline justify-between gap-4 py-3">
    <dt className="text-body-lg text-on-surface">{label}</dt>
    <dd className="text-right">
      {missing ? (
        <span className={hint}>{missing}</span>
      ) : line.due ? (
        <>
          <span className="text-body-lg font-semibold tabular-nums text-primary">
            {formatRupiah(line.zakat)}
          </span>
          <span className={`block ${hint}`}>{period}</span>
        </>
      ) : (
        <span className={hint}>{line.base > 0 ? "Below nisab" : "—"}</span>
      )}
    </dd>
  </div>
);

export const ZakatCalculator = () => {
  const hydrated = useHydrated();
  const { goldPrice, goldGrams, savings, monthlyIncome, incomeNisab, setField, reset } =
    useZakatStore();
  const gramsId = useId();

  const effectiveIncomeNisab = incomeNisab ?? INCOME_NISAB.monthly;
  const result = calculateZakat({
    goldPrice,
    goldGrams,
    savings,
    monthlyIncome,
    incomeNisab: effectiveIncomeNisab,
  });
  const needsGoldPrice = goldPrice <= 0;
  const disabled = !hydrated;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10 px-3">
      <header>
        <h1 className="text-title-lg font-bold tracking-tight">Zakat calculator</h1>
        <p className={`mt-1 ${hint}`}>
          Zakat is 2.5% of wealth that reaches the nisab. Amounts are in rupiah and stay on this
          device.
        </p>
      </header>

      <section aria-labelledby="zakat-gold-label" className="flex flex-col gap-4">
        <h2 id="zakat-gold-label" className="text-body-lg font-semibold">
          Gold
        </h2>
        <RupiahField
          label="Gold price per gram"
          value={hydrated ? goldPrice : 0}
          disabled={disabled}
          onChange={(value) => setField("goldPrice", value)}
        />
        <p className={hint}>
          {result.gold.nisab === null
            ? `The nisab is ${NISAB_GOLD_GRAMS} g of gold. Enter today's price to see it in rupiah; BAZNAS uses the Antam buyback price.`
            : `Nisab: ${NISAB_GOLD_GRAMS} g of gold = ${formatRupiah(result.gold.nisab)}.`}
        </p>
        <label htmlFor={gramsId} className={fieldLabel}>
          Gold held for a full year, in grams
          <input
            id={gramsId}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            disabled={disabled}
            placeholder="0"
            value={hydrated && goldGrams > 0 ? goldGrams : ""}
            onChange={(e) => setField("goldGrams", Math.max(0, Number(e.target.value) || 0))}
            className={field}
          />
        </label>
      </section>

      <section aria-labelledby="zakat-savings-label" className="flex flex-col gap-4">
        <h2 id="zakat-savings-label" className="text-body-lg font-semibold">
          Savings
        </h2>
        <RupiahField
          label="Cash and bank savings held for a full year"
          value={hydrated ? savings : 0}
          disabled={disabled}
          onChange={(value) => setField("savings", value)}
        />
      </section>

      <section aria-labelledby="zakat-income-label" className="flex flex-col gap-4">
        <h2 id="zakat-income-label" className="text-body-lg font-semibold">
          Income
        </h2>
        <RupiahField
          label="Income per month"
          value={hydrated ? monthlyIncome : 0}
          disabled={disabled}
          onChange={(value) => setField("monthlyIncome", value)}
        />
        <RupiahField
          label="Income nisab per month"
          value={hydrated ? effectiveIncomeNisab : 0}
          disabled={disabled}
          onChange={(value) => setField("incomeNisab", value)}
        />
        <p className={hint}>
          BAZNAS sets this every year. {INCOME_NISAB.year}: {formatRupiah(INCOME_NISAB.monthly)} per
          month.
          {incomeNisab !== null && incomeNisab !== INCOME_NISAB.monthly && (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setField("incomeNisab", null)}
                className="font-semibold text-primary"
              >
                Use the BAZNAS figure
              </button>
            </>
          )}
        </p>
      </section>

      <section
        aria-labelledby="zakat-result-label"
        aria-live="polite"
        className="rounded-xl bg-surface-container-low px-4 py-2"
      >
        <h2 id="zakat-result-label" className="sr-only">
          Zakat due
        </h2>
        <dl className="divide-y divide-outline-variant/15">
          <ResultRow
            label="Gold"
            period="per year"
            line={result.gold}
            missing={result.gold.due && needsGoldPrice ? "Enter the gold price" : undefined}
          />
          <ResultRow
            label="Savings"
            period="per year"
            line={result.savings}
            missing={savings > 0 && needsGoldPrice ? "Enter the gold price" : undefined}
          />
          <ResultRow label="Income" period="per month" line={result.income} />
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-body-lg font-semibold text-on-surface">Total for the year</dt>
            <dd className="text-title-lg font-bold tabular-nums text-primary">
              {formatRupiah(result.yearlyTotal)}
            </dd>
          </div>
        </dl>
      </section>

      <button
        type="button"
        onClick={reset}
        disabled={disabled}
        className="flex h-11 items-center self-start rounded-xl px-3 text-label-sm font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]"
      >
        Clear
      </button>

      <p className={hint}>
        Gold and savings each need to reach the value of {NISAB_GOLD_GRAMS} g of gold and be held
        for a Hijri year; income has no waiting period. Rules follow Peraturan Menteri Agama No.
        52/2014 and SK Ketua BAZNAS No. 15/{INCOME_NISAB.year}. This is a guide, so ask an amil or
        a scholar about your own case.
      </p>
    </div>
  );
};
