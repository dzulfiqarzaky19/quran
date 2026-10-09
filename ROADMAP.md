# Roadmap

Task tracker for growing the Quran reader into a daily-use Muslim app. Tick an item when it ships and add a one-line note. Session estimates are rough guesses.

## Done

- [x] **Prayer times + Qibla** — `/prayer`. Location-based schedule, countdown to the next prayer, Qibla compass.
- [x] **Last read, bookmarks, khatam tracker** — `/reading`. Resume row on home, bookmark button under each verse.
- [x] **Dzikir and dua + tasbih counter** — `/dzikir`, `/tasbih`. Local Hisnul Muslim snapshot in `src/data/dzikir/`.
- [x] **Hijri calendar + Ramadan mode** — `/hijri`. Umm al-Qura dates with a day adjustment, imsak/iftar times, fasting tracker.
- [x] **Installable PWA + offline** — manifest, icons, `public/sw.js`. Opened pages and the main sections work offline. Production builds only.
- [x] **Hifz (memorization) mode** — `/hifz`. Hifz mode hides each verse until tapped, a check under the verse marks it memorized, the audio bar repeats a range of ayahs.
- [x] **Tafsir and word-by-word** — tap a word for its transliteration and meaning, or turn on word-by-word in settings. The Tafsir button under each verse opens the tafsir with the verse and the chosen translation. Word meanings are English.
- [x] **Hadith collections** — `/hadith`. Bukhari, Muslim and the 40 Nawawi by book, Arabic with English, search by text or hadith number inside a collection. Fetched at runtime from fawazahmed0/hadith-api, nothing stored in the repo.
- [x] **Everyday duas + dua of the day** — `/dzikir/daily` walks a day from waking up to sleeping, with short topics shown in full. The home page shows one short dua a day from the same topics. No new content: both read the Hisnul Muslim snapshot.
- [x] **Zakat calculator** — `/zakat`. Gold, savings and income against the nisab, in rupiah. Gold price is typed in by hand. Rules from PMA 52/2014 and the BAZNAS income nisab in `src/lib/zakat.ts`.

## Next (ranked)

- [ ] **Mosque and halal finder** — nearby places on a map. About 2 sessions. Needs a maps or places API, likely with an API key and possibly a cost.

## Blocked on a decision

- [ ] **Adhan notifications** — web push needs a backend (VAPID keys, stored subscriptions, a scheduler at each prayer time). The app has none. Decide whether to add one.
- [ ] **Hisnul Muslim translation licence** — unverified, and the snapshot is in the public repo. Verify it or replace the translation.
- [ ] **Hadith translation licence** — the hadith-api repo is Unlicense, but it does not say who translated the English texts or under what terms. Verify it or switch source (one module: `src/lib/hadith.ts`).

## Loose ends

- [ ] Zakat: update `INCOME_NISAB` in `src/lib/zakat.ts` each year when BAZNAS issues the new SK (currently No. 15/2026).

- [ ] Hadith: the first visit to a collection downloads its whole English edition (about 5 to 7 seconds here), then keeps it in memory for a day. Cache the book list if this is slow in production.
- [ ] Hadith pages are online only, apart from ones already opened.

- [ ] Test the home-screen install on a real phone. Needs a deployed HTTPS URL.
- [ ] Check the default Hijri date adjustment for Indonesia (Umm al-Qura can run a day ahead of the Kemenag announcement).
- [ ] Verify the imsak offset (Fajr minus 10 minutes) against a Kemenag source.
- [ ] Offline audio recitation. Third-party API and audio requests are not cached.
- [ ] Add a jest config. `npx jest` does not run, so `src/lib/hijri.ts` has no unit test.
- [ ] Fix `src/lib/api.test.ts`: it imports `fetchIndonesianTranslation`, which `src/lib/api.ts` does not export.
- [ ] Point the git remote at the lowercase repo name: `git remote set-url origin git@github.com:dzulfiqarzaky19/quran.git`.
