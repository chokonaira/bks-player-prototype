import AudioCard from "@/components/AudioCard";
import Discovery from "@/components/Discovery";
import { AUDIOS } from "@/lib/mockData";

export default function Browse() {
  return (
    <>
      <h1 className="mb-4 font-serif text-3xl text-ink md:text-4xl">Browse</h1>
      <Discovery>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {AUDIOS.map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      </Discovery>
    </>
  );
}
