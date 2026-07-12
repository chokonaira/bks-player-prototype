import { AUDIOS } from "@/lib/mockData";
import AudioCard from "@/components/AudioCard";
import { notFound } from "next/navigation";

export default function AudioDetail({ params }: { params: { id: string } }) {
  const audio = AUDIOS.find((a) => a.id === params.id);
  if (!audio) return notFound();
  return (
    <article>
      <div className={`aspect-video w-full rounded-2xl bg-gradient-to-br ${audio.cover}`} />
      <h1 className="mt-6 font-serif text-3xl text-white">{audio.title}</h1>
      <p className="mt-2 text-white/60">{audio.voiceActor} · {audio.category}</p>
      <div className="mt-6">
        <AudioCard audio={audio} />
      </div>
    </article>
  );
}
