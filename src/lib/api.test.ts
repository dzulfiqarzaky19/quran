import { fetchSurahList, fetchSurah, fetchTafsir, fetchIndonesianTranslation } from './api';

global.fetch = jest.fn();

describe('Quran API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('fetchSurahList returns data', async () => {
    const mockData = [{ surahName: 'Al-Fatihah' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchSurahList();
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://quranapi.pages.dev/api/surah.json');
  });

  it('fetchSurah returns data', async () => {
    const mockData = { surahName: 'Al-Fatihah' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchSurah(1);
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://quranapi.pages.dev/api/1.json');
  });

  it('fetchTafsir returns data', async () => {
    const mockData = { tafsirs: [] };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchTafsir(1, 1);
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://quranapi.pages.dev/api/tafsir/1/1.json');
  });

  it('fetchIndonesianTranslation returns mapped text array', async () => {
    const mockData = {
      data: {
        ayahs: [{ text: 'Dengan nama Allah' }, { text: 'Segala puji bagi Allah' }],
      },
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchIndonesianTranslation(1);
    expect(data).toEqual(['Dengan nama Allah', 'Segala puji bagi Allah']);
    expect(fetch).toHaveBeenCalledWith('https://api.alquran.cloud/v1/surah/1/id.indonesian');
  });
});
