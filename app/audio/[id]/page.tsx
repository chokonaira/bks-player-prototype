"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { AUDIOS, initials, type Comment } from "@/lib/mockData";
import { usePlayer } from "@/components/PlayerProvider";
import { useFavorites } from "@/lib/useFavorites";
import { useLocalAdditions } from "@/lib/useLocalAdditions";
import { useLocale } from "@/components/LocaleProvider";
import { Play, Pause, Heart, Bookmark, Clock, ArrowDownToLine } from "lucide-react";
import { useOffline } from "@/lib/useOffline";
import { useOnlineStatus } from "@/lib/useOnlineStatus";

export default function AudioDetail({ params }: { params: { id: string } }) {
  const audio = AUDIOS.find((a) => a.id === params.id);
  const { play, toggle, current, playing } = usePlayer();
  const { t } = useLocale();
  const { isFav, toggle: toggleFav } = useFavorites();
  const { enabled: savedOffline } = useOffline();
  const online = useOnlineStatus();
  const locked = !online && !savedOffline;
  const [liked, setLiked] = useState(false);
  const { items: comments, add: addComment } = useLocalAdditions<Comment>(
    `bks-comments-${params.id}`,
    audio?.comments ?? []
  );
  const [draft, setDraft] = useState("");

  if (!audio) return notFound();

  const isCurrent = current?.id === audio.id;
  const isPlaying = isCurrent && playing;
  const fav = isFav(audio.id);

  const postComment = () => {
    const text = draft.trim();
    if (!text) return;
    addComment({ author: "you", when: "just now", text });
    setDraft("");
  };

  return (
    <article className="mx-auto max-w-2xl">
      {/* hero */}
      <div className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br ${audio.cover} shadow-xl shadow-black/15 ${isPlaying ? "ambient-playing" : ""}`}>
        <span aria-hidden className="cover-texture" />
        <div className="ambient-blob ambient-blob-a" />
        <div className="ambient-blob ambient-blob-b" />
        <span className="absolute inset-0 grid place-items-center font-serif text-7xl italic text-white/10">
          {initials(audio.title)}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
          {audio.tier} Tier
        </span>
      </div>

      <h1 className="mt-6 font-serif text-3xl text-ink md:text-4xl">{audio.title}</h1>
      <p className="mt-2 text-sm text-ink/60">{audio.voiceActor} · {t("detail.writtenBy")} {audio.writer}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-coral/15 px-3 py-1 text-coral">{audio.category}</span>
        <span className="flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1 text-ink/60">
          <Clock className="h-3 w-3" strokeWidth={1.8} /> {Math.round(audio.duration / 60)} {t("player.min")}
        </span>
        {savedOffline && (
          <span className="flex items-center gap-1 rounded-full bg-coral/15 px-3 py-1 text-coral">
            <ArrowDownToLine className="h-3 w-3" strokeWidth={2} /> {t("offline.saved")}
          </span>
        )}
      </div>

      {/* actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => !locked && (isCurrent ? toggle() : play(audio))}
          aria-disabled={locked}
          className={`flex items-center gap-2 rounded-full bg-coral px-6 py-2.5 text-sm font-medium text-black transition hover:opacity-90 ${locked ? "cursor-not-allowed opacity-40 grayscale" : ""}`}
        >
          {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          {isPlaying ? t("detail.pause") : isCurrent ? t("detail.resume") : t("detail.play")}
        </button>
        <button
          onClick={() => setLiked((l) => !l)}
          aria-label={liked ? "Unlike" : "Like"}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition ${
            liked ? "border-coral/60 text-coral" : "border-ink/15 text-ink/60 hover:border-ink/30"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-coral" : ""}`} strokeWidth={1.8} />
          {audio.likes + (liked ? 1 : 0)}
        </button>
        <button
          onClick={() => toggleFav(audio.id)}
          aria-label={fav ? "Remove from favorites" : "Save to favorites"}
          className={`grid h-10 w-10 place-items-center rounded-full border transition ${
            fav ? "border-coral/60 text-coral" : "border-ink/15 text-ink/60 hover:border-ink/30"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${fav ? "fill-coral" : ""}`} strokeWidth={1.8} />
        </button>
      </div>

      {/* description */}
      <p className="mt-6 text-sm leading-relaxed text-ink/70">{audio.description}</p>

      {/* comments */}
      <section className="mt-8 border-t border-ink/10 pt-6">
        <h2 className="mb-4 font-serif text-xl text-ink md:text-2xl">
          {t("detail.comments")} <span className="text-ink/40">({comments.length})</span>
        </h2>
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("detail.commentPlaceholder")}
          className="w-full resize-none rounded-xl border border-ink/10 bg-ink/[0.04] p-3 text-sm text-ink placeholder:text-ink/30 focus:border-coral/50 focus:outline-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={postComment}
            disabled={!draft.trim()}
            className="rounded-full bg-coral px-5 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40"
          >
            {t("detail.postComment")}
          </button>
        </div>
        <ul className="mt-5 space-y-4">
          {comments.map((c, i) => (
            <li key={`${c.author}-${i}`} className="rounded-xl bg-ink/[0.03] p-4">
              <p className="text-xs text-ink/50">
                <span className={`font-medium ${c.author === "you" ? "text-coral" : "text-ink/80"}`}>{c.author}</span>
                <span className="ml-2">{c.when}</span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{c.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
