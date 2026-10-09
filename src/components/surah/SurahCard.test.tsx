import { render, screen } from '@testing-library/react';
import { SurahCard } from './SurahCard';
import { Surah } from '@/lib/types';

const mockSurah: Surah = {
  surahNo: 1,
  surahName: 'Al-Fatihah',
  surahNameArabic: 'الفاتحة',
  surahNameArabicLong: 'سُورَةُ ٱلْفَاتِحَةِ',
  surahNameTranslation: 'The Opening',
  revelationPlace: 'Mecca',
  totalAyah: 7
};

describe('SurahCard', () => {
  it('renders correctly', () => {
    render(<SurahCard surah={mockSurah} />);

    expect(screen.getByText('Al-Fatihah')).toBeInTheDocument();
    expect(screen.getByText('الفاتحة')).toBeInTheDocument();
    expect(screen.getByText('The Opening · 7 verses')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/surah/1');
  });
});
