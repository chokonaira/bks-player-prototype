export type Audio = {
  id: string;
  title: string;
  voiceActor: string;
  writer: string;
  duration: number; // seconds
  category: string;
  tier: "Honey" | "Angel" | "Secret";
  cover: string;   // gradient token, no external assets
  src: string;     // placeholder audio in /public/audio
  progress?: number; // 0..1 resume point
};

export const AUDIOS: Audio[] = [
  {
    id: "539",
    title: "Ours",
    voiceActor: "Mr. Chambers, Mr. Gallo, Mr. Robinson",
    writer: "Ellie",
    duration: 5568,
    category: "Friends to Lovers",
    tier: "Secret",
    cover: "from-[#3a2420] to-[#0d0d0d]",
    src: "/audio/sample-1.mp3",
    progress: 0.32,
  },
  {
    id: "435",
    title: "Call Me When You Need Me",
    voiceActor: "Mr. Robinson",
    writer: "Ellie, Violet Times",
    duration: 2700,
    category: "Comfy Boyfriend",
    tier: "Angel",
    cover: "from-[#2b2b33] to-[#0d0d0d]",
    src: "/audio/sample-2.mp3",
    progress: 0.66,
  },
  {
    id: "845",
    title: "Our Little Secret",
    voiceActor: "Mr. Robinson",
    writer: "Violet Times",
    duration: 4080,
    category: "Against the Rules",
    tier: "Secret",
    cover: "from-[#402a2e] to-[#141018]",
    src: "/audio/sample-1.mp3",
  },
  {
    id: "1111",
    title: "A Quiet Withdrawal",
    voiceActor: "Mr. Gallo",
    writer: "Improv",
    duration: 2460,
    category: "Strangers to Lovers",
    tier: "Angel",
    cover: "from-[#33251c] to-[#0f0d0d]",
    src: "/audio/sample-2.mp3",
  },
  {
    id: "1108",
    title: "Meet The Mafia",
    voiceActor: "Mr. Gallo",
    writer: "Nicole K",
    duration: 3720,
    category: "In Charge",
    tier: "Secret",
    cover: "from-[#4a2b22] to-[#100c0c]",
    src: "/audio/sample-1.mp3",
  },
];

export const CONTINUE = AUDIOS.filter((a) => a.progress);

export const initials = (title: string) =>
  title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
