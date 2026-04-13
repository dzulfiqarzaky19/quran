import { render, screen } from '@testing-library/react';
import { VerseCard } from './VerseCard';

jest.mock('@/store', () => ({
  useAppStore: () => ({
    isPlaying: false,
    setActiveVerse: jest.fn(),
  })
}));

describe('VerseCard', () => {
  it('renders correctly', () => {
    const defaultProps = {
      surahNo: 1,
      ayahNo: 1,
      arabic: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      translationId: 33,
      tajweedData: ""
    };

    render(
      <VerseCard {...defaultProps} />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ')).toBeInTheDocument();
    expect(screen.getByText('In the name of Allah, the Entirely Merciful, the Especially Merciful.')).toBeInTheDocument();
    expect(screen.getByText('Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.')).toBeInTheDocument();
  });
});
