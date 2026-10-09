interface VerseHeaderProps {
  ayahNo: number;
  totalAyah: number;
}

export const VerseHeader = ({ ayahNo, totalAyah }: VerseHeaderProps) => (
  <p className="text-label-sm font-bold tracking-[0.05em] text-on-surface-variant uppercase">
    Ayah {ayahNo} of {totalAyah}
  </p>
);
