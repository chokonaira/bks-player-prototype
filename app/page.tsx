import ContinueListeningRail from "@/components/ContinueListeningRail";
import AudioCard from "@/components/AudioCard";
import Discovery from "@/components/Discovery";
import { AUDIOS } from "@/lib/mockData";

export default function Home() {
  return (
    <>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-coral">Prototype</p>
        <h1 className="font-serif text-4xl text-ink md:text-5xl">Best Kept Secret</h1>
        <p className="mt-1 text-sm text-ink/50">Mobile-first player & discovery concept</p>
      </header>

      <Discovery>
      <ContinueListeningRail />

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-2xl text-ink md:text-3xl">For You</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {AUDIOS.map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-2xl text-ink md:text-3xl">New Releases</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...AUDIOS].reverse().map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      </section>
      </Discovery>
    </>
  );
}
