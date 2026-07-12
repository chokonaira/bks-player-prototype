"use client";

import { useState } from "react";
import { MessageCircle, Lightbulb, Heart, Check, Radio, Send, Users } from "lucide-react";
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
  { text: "He reads to you until you fall asleep, and keeps reading anyway", author: "Community", likes: 33, liked: false },
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

      <section className="mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-[#3a2420] via-[#271817] to-[#0d0d0d] p-5 text-white shadow-xl shadow-black/10 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/75 backdrop-blur">
              <Radio className="h-3.5 w-3.5 text-coral" strokeWidth={2} />
              {t("community.liveRoom")}
            </div>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight md:text-4xl">{t("community.listenAlong")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">{t("community.listenAlongNote")}</p>
          </div>
          <div className="hidden rounded-lg border border-white/10 bg-white/10 p-3 text-center backdrop-blur md:block">
            <p className="text-2xl font-semibold">8pm</p>
            <p className="text-xs text-white/60">EST</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur">
            <p className="text-lg font-semibold">1.2k</p>
            <p className="mt-0.5 text-[11px] text-white/55">{t("community.members")}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur">
            <p className="text-lg font-semibold">{total}</p>
            <p className="mt-0.5 text-[11px] text-white/55">{t("community.votesShort")}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur">
            <p className="text-lg font-semibold">{ideas.length}</p>
            <p className="mt-0.5 text-[11px] text-white/55">{t("community.ideasShort")}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-ink/10 bg-surface p-5 shadow-sm shadow-black/5">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-coral/15 text-coral">
                <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="font-medium text-ink">{t("community.voteTitle")}</h2>
                <p className="text-xs text-ink/50">{total} {t("community.votes")}</p>
              </div>
            </div>
            <div className="space-y-3">
              {POLL.map((o) => {
                const v = o.votes + (voted === o.id ? 1 : 0);
                const pct = Math.round((v / total) * 100);
                const selected = voted === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setVoted(o.id)}
                    disabled={voted !== null}
                    className={`relative w-full overflow-hidden rounded-lg border p-3 text-left text-sm transition ${
                      selected
                        ? "border-coral bg-coral/10 text-ink"
                        : voted !== null
                        ? "border-ink/10 text-ink/45"
                        : "border-ink/10 bg-ink/[0.02] text-ink/75 hover:border-coral/40"
                    }`}
                  >
                    <span
                      className={`absolute inset-y-0 left-0 bg-coral/15 transition-all duration-700 ${voted === null ? "opacity-0" : "opacity-100"}`}
                      style={{ width: `${pct}%` }}
                    />
                    <span className="relative flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2">
                        {selected && (
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-coral">
                            <Check className="h-3 w-3 text-black" strokeWidth={3} />
                          </span>
                        )}
                        <span>{o.label}</span>
                      </span>
                      <span className="shrink-0 text-xs text-ink/45">{voted === null ? `${o.votes}` : `${pct}%`}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {voted !== null && <p className="mt-3 text-xs text-coral">{t("community.voteThanks")}</p>}
          </section>

          <section className="rounded-lg border border-ink/10 bg-surface p-5 shadow-sm shadow-black/5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-coral/15 text-coral">
                <Lightbulb className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="font-medium text-ink">{t("community.ideaTitle")}</h2>
                <p className="text-xs text-ink/50">{t("community.ideaNote")}</p>
              </div>
            </div>
            <textarea
              rows={4}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("community.ideaPlaceholder")}
              className="mt-4 w-full resize-none rounded-lg border border-ink/10 bg-ink/[0.04] p-3 text-sm text-ink placeholder:text-ink/30 focus:border-coral/50 focus:outline-none"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={submitIdea}
                disabled={!draft.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" strokeWidth={1.8} />
                {t("community.sendIdea")}
              </button>
              {sent && <span className="text-xs text-coral">{t("community.ideaSent")}</span>}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-lg border border-ink/10 bg-surface p-5 shadow-sm shadow-black/5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-coral/15 text-coral">
                  <Users className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-medium text-ink">{t("community.recentIdeas")}</h3>
                  <p className="text-xs text-ink/45">{t("community.feedNote")}</p>
                </div>
              </div>
              <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink/45">{ideas.length}</span>
            </div>
            <ul className="space-y-2">
              {ideas.map((idea, i) => {
                const liked = !!likedIdeas[idea.text];
                return (
                  <li key={`${idea.text}-${i}`}
                    className="flex items-start justify-between gap-3 rounded-lg border border-ink/10 bg-ink/[0.02] p-3">
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
          </section>
        </aside>
      </div>
    </>
  );
}
