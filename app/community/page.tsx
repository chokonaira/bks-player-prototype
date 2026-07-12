"use client";

import { useState } from "react";
import { MessageCircle, Lightbulb, Headphones, Heart, Check } from "lucide-react";
import { useLocalAdditions } from "@/lib/useLocalAdditions";
import { useLocale } from "@/components/LocaleProvider";

const POLL = [
  { id: "a", label: "Bodyguard who finally confesses", votes: 214 },
  { id: "b", label: "Slow burn with your best friend's brother", votes: 187 },
  { id: "c", label: "Comfort audio after a hard week", votes: 243 },
];

type Idea = { text: string; author: string; likes: number; liked: boolean };

const SEED_IDEAS: Idea[] = [
  { text: "A slow dance in the kitchen at 2am, no music, just him humming", author: "Community", likes: 41, liked: false },
  { text: "He reads to you until you fall asleep — and keeps reading anyway", author: "Community", likes: 33, liked: false },
];

export default function Community() {
  const { t } = useLocale();
  const [voted, setVoted] = useState<string | null>(null);
  const { items: ideas, add: addIdea } = useLocalAdditions<Idea>("bks-ideas", SEED_IDEAS);
  const [likedIdeas, setLikedIdeas] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);
  const total = POLL.reduce((s, o) => s + o.votes, 0) + (voted ? 1 : 0);

  const submitIdea = () => {
    const text = draft.trim();
    if (!text) return;
    addIdea({ text, author: "You", likes: 0, liked: false });
    setDraft("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  const likeIdea = (text: string) =>
    setLikedIdeas((prev) => ({ ...prev, [text]: !prev[text] }));

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink md:text-4xl">{t("nav.community")}</h1>
        <p className="mt-1 text-sm text-ink/50">{t("community.sub")}</p>
      </header>

      <section className="mb-6 rounded-2xl border border-ink/10 bg-ink/[0.03] p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-coral/15 text-coral">
            <Headphones className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="font-medium text-ink">{t("community.listenAlong")}</h2>
            <p className="text-xs text-ink/50">{t("community.listenAlongNote")}</p>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-ink/10 bg-ink/[0.03] p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-coral/15 text-coral">
            <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="font-medium text-ink">{t("community.voteTitle")}</h2>
            <p className="text-xs text-ink/50">{total} {t("community.votes")}</p>
          </div>
        </div>
        <div className="space-y-2">
          {POLL.map((o) => {
            const v = o.votes + (voted === o.id ? 1 : 0);
            const pct = Math.round((v / total) * 100);
            return (
              <button
                key={o.id}
                onClick={() => setVoted(o.id)}
                disabled={voted !== null}
                className={`relative w-full overflow-hidden rounded-xl border p-3 text-left text-sm transition ${
                  voted === o.id
                    ? "border-coral bg-coral/10 text-ink"
                    : voted !== null
                    ? "border-transparent text-ink/45"
                    : "border-ink/10 text-ink/70 hover:border-ink/25"
                }`}
              >
                {voted !== null && (
                  <span
                    className="absolute inset-y-0 left-0 bg-coral/15 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="relative flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    {voted === o.id && (
                      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-coral">
                        <Check className="h-3 w-3 text-black" strokeWidth={3} />
                      </span>
                    )}
                    <span>{o.label}</span>
                  </span>
                  {voted !== null && <span className="shrink-0 text-xs text-ink/50">{pct}%</span>}
                </span>
              </button>
            );
          })}
        </div>
        {voted !== null && <p className="mt-3 text-xs text-coral">{t("community.voteThanks")}</p>}
      </section>

      <section className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-coral/15 text-coral">
            <Lightbulb className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="font-medium text-ink">{t("community.ideaTitle")}</h2>
            <p className="text-xs text-ink/50">{t("community.ideaNote")}</p>
          </div>
        </div>
        <textarea
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("community.ideaPlaceholder")}
          className="mt-4 w-full resize-none rounded-xl border border-ink/10 bg-ink/[0.04] p-3 text-sm text-ink placeholder:text-ink/30 focus:border-coral/50 focus:outline-none"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={submitIdea}
            disabled={!draft.trim()}
            className="rounded-full bg-coral px-5 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40"
          >
            {t("community.sendIdea")}
          </button>
          {sent && <span className="text-xs text-coral">{t("community.ideaSent")}</span>}
        </div>

        <div className="mt-6 border-t border-ink/10 pt-4">
          <h3 className="mb-3 text-sm font-medium text-ink/70">{t("community.recentIdeas")}</h3>
          <ul className="space-y-2">
            {ideas.map((idea, i) => {
              const liked = !!likedIdeas[idea.text];
              return (
                <li key={`${idea.text}-${i}`}
                  className="flex items-start justify-between gap-3 rounded-xl bg-ink/[0.03] p-3">
                  <div className="min-w-0">
                    <p className="text-sm text-ink/85">{idea.text}</p>
                    <p className="mt-1 text-[11px] text-ink/40">{idea.author}</p>
                  </div>
                  <button
                    onClick={() => likeIdea(idea.text)}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink/60 transition hover:bg-ink/10"
                  >
                    <Heart className={`h-3 w-3 ${liked ? "fill-coral text-coral" : ""}`} strokeWidth={1.8} />
                    {idea.likes + (liked ? 1 : 0)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
