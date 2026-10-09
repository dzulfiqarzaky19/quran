# Roadmap

Task tracker for growing the Quran reader into a daily-use Muslim app. Tick an item when it ships and add a one-line note. Session estimates are rough guesses.

## Done

- [x] **Prayer times + Qibla** — `/prayer`. Location-based schedule, countdown to the next prayer, Qibla compass.
- [x] **Last read, bookmarks, khatam tracker** — `/reading`. Resume row on home, bookmark button under each verse.
- [x] **Dzikir and dua + tasbih counter** — `/dzikir`, `/tasbih`. Local Hisnul Muslim snapshot in `src/data/dzikir/`.
- [x] **Hijri calendar + Ramadan mode** — `/hijri`. Umm al-Qura dates with a day adjustment, imsak/iftar times, fasting tracker.
- [x] **Installable PWA + offline** — manifest, icons, `public/sw.js`. Opened pages and the main sections work offline. Production builds only.
- [x] **Hifz (memorization) mode** — `/hifz`. Hifz mode hides each verse until tapped, a check under the verse marks it memorized, the audio bar repeats a range of ayahs.

## Next (ranked)

- [ ] **Tafsir and word-by-word** — tap a word for its meaning, open a tafsir under each verse. About 1 to 2 sessions. `src/lib/api.ts` already calls a tafsir API; check how much is wired into the UI first.
- [ ] **Zakat calculator** — gold, savings and income inputs, nisab threshold, result. About 1 session. Needs a gold price: a price API or manual entry.
- [ ] **Hadith collections** — browse and search Bukhari, Muslim and the 40 Nawawi. About 1 to 2 sessions. Needs a source with a clear licence.
- [ ] **Mosque and halal finder** — nearby places on a map. About 2 sessions. Needs a maps or places API, likely with an API key and possibly a cost.

## Blocked on a decision

- [ ] **Adhan notifications** — web push needs a backend (VAPID keys, stored subscriptions, a scheduler at each prayer time). The app has none. Decide whether to add one.
- [ ] **Hisnul Muslim translation licence** — unverified, and the snapshot is in the public repo. Verify it or replace the translation.

## Loose ends

- [ ] Test the home-screen install on a real phone. Needs a deployed HTTPS URL.
- [ ] Check the default Hijri date adjustment for Indonesia (Umm al-Qura can run a day ahead of the Kemenag announcement).
- [ ] Verify the imsak offset (Fajr minus 10 minutes) against a Kemenag source.
- [ ] Offline audio recitation. Third-party API and audio requests are not cached.
- [ ] Add a jest config. `npx jest` does not run, so `src/lib/hijri.ts` has no unit test.
- [ ] Fix `src/lib/api.test.ts`: it imports `fetchIndonesianTranslation`, which `src/lib/api.ts` does not export.
- [ ] Point the git remote at the lowercase repo name: `git remote set-url origin git@github.com:dzulfiqarzaky19/quran.git`.
