import { render, screen, waitFor } from '@testing-library/react';
import { TafsirModal } from './TafsirModal';

jest.mock('@/store', () => ({
  useAppStore: () => ({
    tafsirOpen: true,
    tafsirVerse: { surah: 1, ayah: 1 },
    closeTafsir: jest.fn(),
    tafsirSource: 'ibn-kathir',
    setTafsirSource: jest.fn(),
  }),
}));

global.fetch = jest.fn() as jest.Mock;

describe('TafsirModal', () => {
  it('renders loading state initially and then data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tafsirs: [
          { author: 'Ibn Kathir', content: 'In the name of Allah.' }
        ]
      })
    });

    render(<TafsirModal />);
    
    expect(screen.getByText('Loading Tafsir...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('In the name of Allah.')).toBeInTheDocument();
    });
  });
});
