import { render, screen } from '@testing-library/react';
import { TafsirModal } from './TafsirModal';

global.fetch = jest.fn() as jest.Mock;

describe('TafsirModal SSR', () => {
  it('renders tafsir data natively as a Server Component', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tafsirs: [
          { author: 'Ibn Kathir', content: 'In the name of Allah.' }
        ]
      })
    });

    const jsx = await TafsirModal({
      surah: 1,
      ayah: 1,
      arabic: 'بِسْمِ اللَّهِ',
      translation: 'Dengan menyebut nama Allah',
      source: 'ibn-kathir'
    });

    render(jsx);
    
    expect(screen.getByText('In the name of Allah.')).toBeInTheDocument();
    expect(screen.getByText('بِسْمِ اللَّهِ')).toBeInTheDocument();
    expect(screen.getByText(/"Dengan menyebut nama Allah"/)).toBeInTheDocument();
  });
});
