export interface TajweedRule {
  color: string;
  description: string;
}

// this is for white background for now commented
// export const TAJWEED_RULES: Record<string, TajweedRule> = {
//   h: { color: "#AAAAAA", description: "Hamzat ul Wasl" },
//   s: { color: "#AAAAAA", description: "Silent" },
//   l: { color: "#AAAAAA", description: "Lam Shamsiyyah" },
//   n: { color: "#537FFF", description: "Normal Prolongation: 2 Vowels" },
//   p: { color: "#4050FF", description: "Permissible Prolongation: 2, 4, 6 Vowels" },
//   m: { color: "#000EBC", description: "Necessary Prolongation: 6 Vowels" },
//   q: { color: "#DD0008", description: "Qalaqah" },
//   o: { color: "#2144C1", description: "Obligatory Prolongation: 4-5 Vowels" },
//   c: { color: "#D500B7", description: "Ikhafa' Shafawi - With Meem" },
//   f: { color: "#9400A8", description: "Ikhafa'" },
//   w: { color: "#58B800", description: "Idgham Shafawi - With Meem" },
//   i: { color: "#26BFFD", description: "Iqlab" },
//   a: { color: "#169777", description: "Idgham - With Ghunnah" },
//   u: { color: "#169200", description: "Idgham - Without Ghunnah" },
//   d: { color: "#A1A1A1", description: "Idgham - Mutajanisayn" },
//   b: { color: "#A1A1A1", description: "Idgham - Mutaqaribayn" },
//   g: { color: "#FF7E1E", description: "Ghunnah: 2 Vowels MIMM/NOON with SHADEH" },
// };

export const TAJWEED_RULES: Record<string, TajweedRule> = {
  // Neutral / Administrative (Silent/Wasl)
  h: { color: "#8E9196", description: "Hamzat ul Wasl" }, // Slightly lighter gray
  s: { color: "#8E9196", description: "Silent" },
  l: { color: "#8E9196", description: "Lam Shamsiyyah" },

  // Prolongations (Blues/Purples - Shifted to Cyan/Light Blue)
  n: { color: "#80A4FF", description: "Normal Prolongation: 2 Vowels" },
  p: { color: "#A0B5FF", description: "Permissible Prolongation: 2, 4, 6 Vowels" },
  m: { color: "#5C6BFF", description: "Necessary Prolongation: 6 Vowels" },
  o: { color: "#4DB6AC", description: "Obligatory Prolongation: 4-5 Vowels" }, // Teal/Cyan for better contrast

  // Qalaqah (Red - Shifted to Coral/Light Red)
  q: { color: "#FF5252", description: "Qalaqah" },

  // Ikhfa' (Purples/Magental - Lightened)
  c: { color: "#F06292", description: "Ikhafa' Shafawi - With Meem" },
  f: { color: "#BA68C8", description: "Ikhafa'" },

  // Idgham & Ghunnah (Greens/Oranges - Brightened)
  w: { color: "#81C784", description: "Idgham Shafawi - With Meem" },
  i: { color: "#4FC3F7", description: "Iqlab" },
  a: { color: "#4DB6AC", description: "Idgham - With Ghunnah" },
  u: { color: "#AED581", description: "Idgham - Without Ghunnah" },

  // Idgham Variants (Grayish)
  d: { color: "#BDBDBD", description: "Idgham - Mutajanisayn" },
  b: { color: "#BDBDBD", description: "Idgham - Mutaqaribayn" },

  // Ghunnah (Orange - High Energy)
  g: { color: "#FFB74D", description: "Ghunnah: 2 Vowels" },
};

export interface TajweedSegment {
  text: string;
  rule?: TajweedRule;
}

/**
 * Parses Tajweed markers from the text.
 * Format: [rule_char:optional_id[content]
 */
export function parseTajweed(text: string): TajweedSegment[] {
  const segments: TajweedSegment[] = [];
  const regex = /\[([a-z]):?(?:[0-9]+)?\[([^\]]*)\]/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.substring(lastIndex, match.index) });
    }

    const ruleChar = match[1];
    const content = match[2];
    const rule = TAJWEED_RULES[ruleChar];

    segments.push({
      text: content,
      rule: rule || undefined,
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.substring(lastIndex) });
  }

  return segments;
}

export interface TajweedWord {
  segments: TajweedSegment[];
  isStopMark: boolean;
}

export function getTajweedWords(ayahText: string): TajweedWord[] {
  const rawSegments = parseTajweed(ayahText);
  const words: TajweedWord[] = [];
  let currentWordSegments: TajweedSegment[] = [];

  for (const segment of rawSegments) {
    const parts = segment.text.split(/(\s+)/);

    for (const part of parts) {
      if (part.trim() === "") {
        if (currentWordSegments.length > 0) {
          words.push({
            segments: currentWordSegments,
            isStopMark: currentWordSegments.every(s => isStopMarkOnly(s.text))
          });
          currentWordSegments = [];
        }
      } else {
        currentWordSegments.push({
          text: part,
          rule: segment.rule
        });
      }
    }
  }

  if (currentWordSegments.length > 0) {
    words.push({
      segments: currentWordSegments,
      isStopMark: currentWordSegments.every(s => isStopMarkOnly(s.text))
    });
  }

  return words;
}

export const STOP_MARKS_REGEX = /[\u0615\u06D6-\u06DC\u06E2\u06E8]/;

export function isStopMarkOnly(text: string): boolean {
  return /^[\s\u200c]*[\u0615\u06D6-\u06DC\u06E2\u06E8][\s\u200c]*$/.test(text);
}
