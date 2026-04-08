import { render, screen } from '@testing-library/react';
import { SurahCard, SurahWithNo } from './SurahCard';

const mockSurah: SurahWithNo = {
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
    expect(screen.getByText('The Opening')).toBeInTheDocument();
    expect(screen.getByText('Mecca • 7 VERSES')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
