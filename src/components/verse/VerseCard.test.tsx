import { render, screen } from '@testing-library/react';
import { VerseCard } from './VerseCard';

jest.mock('@/store', () => ({
  useAppStore: () => ({
    activeVerse: null,
    setActiveVerse: jest.fn(),
    openTafsir: jest.fn(),
  })
}));

describe('VerseCard', () => {
  it('renders correctly', () => {
    render(
      <VerseCard 
        surahNo={1} 
        ayahNo={1} 
        arabic="بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ" 
        english="In the name of Allah, the Entirely Merciful, the Especially Merciful." 
        indonesian="Dengan nama Allah Yang Maha Pengasih, Maha Penyayang." 
      />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ')).toBeInTheDocument();
    expect(screen.getByText('In the name of Allah, the Entirely Merciful, the Especially Merciful.')).toBeInTheDocument();
    expect(screen.getByText('Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.')).toBeInTheDocument();
  });
});
