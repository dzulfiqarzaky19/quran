export const toArabicNumber = (num: number | string): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((d) => (isNaN(parseInt(d)) ? d : arabicDigits[parseInt(d)]))
    .join('');
};
