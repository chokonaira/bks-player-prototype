export type Comment = { author: string; when: string; text: string };

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
  description: string;
  likes: number;
  comments: Comment[];
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
    description:
      "You all met young, and the friendship was always meant to be. One snowed-in weekend, years of unspoken history finally come to light — honesty, warmth, and a fresh start.",
    likes: 75,
    comments: [
      { author: "sky0927", when: "2d ago", text: "Omg, so good. I could practically see myself in that situation." },
      { author: "moonlit_reader", when: "5d ago", text: "The aftercare part had me tearing up. Nobody writes that — BKS does." },
    ],
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
    description:
      "A long day melts away the moment he picks up. Soft reassurance, gentle teasing, and a voice that stays on the line until you're asleep.",
    likes: 62,
    comments: [
      { author: "violet.hour", when: "1d ago", text: "Fell asleep to this three nights straight. No regrets." },
    ],
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
    description:
      "Some things are better kept quiet. Stolen glances, whispered plans, and the thrill of what nobody else knows.",
    likes: 48,
    comments: [
      { author: "latenight_lis", when: "3d ago", text: "Mr. Robinson understood the assignment. Again." },
    ],
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
    description:
      "A chance meeting at closing time turns into the conversation neither of you wants to end.",
    likes: 33,
    comments: [
      { author: "quiet.corner", when: "1w ago", text: "The improv makes it feel so real. Like he's actually there." },
    ],
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
    description:
      "He runs the city, but tonight he's all yours. Protective, commanding, and unexpectedly gentle.",
    likes: 91,
    comments: [
      { author: "sky0927", when: "4d ago", text: "THE VOICES. My mouth was agape for twenty minutes straight." },
      { author: "ember&ash", when: "6d ago", text: "Best subscription of the year, not even close." },
    ],
  },
];

export const CONTINUE = AUDIOS.filter((a) => a.progress);

export const initials = (title: string) =>
  title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
