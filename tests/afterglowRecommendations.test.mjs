import test from "node:test";
import assert from "node:assert/strict";
import { AFTERGLOW_MOODS, nextAudio, recommendationFor } from "../lib/afterglowRecommendations.mjs";

const audios = [
  { id: "ours", title: "Ours", category: "Friends to Lovers", tier: "Secret", voiceActor: "Mr. Chambers" },
  { id: "call", title: "Call Me When You Need Me", category: "Comfy Boyfriend", tier: "Angel", voiceActor: "Mr. Robinson" },
  { id: "secret", title: "Our Little Secret", category: "Against the Rules", tier: "Secret", voiceActor: "Mr. Robinson" },
  { id: "quiet", title: "A Quiet Withdrawal", category: "Strangers to Lovers", tier: "Angel", voiceActor: "Mr. Gallo" },
];

test("exports the supported afterglow moods", () => {
  assert.deepEqual(AFTERGLOW_MOODS, ["soft", "wanted", "comforted", "part2"]);
});

test("falls back to the next catalog item without a mood", () => {
  assert.equal(recommendationFor(audios, audios[0], null).id, "call");
  assert.equal(nextAudio(audios, audios.at(-1)).id, "ours");
});

test("comforted mood prefers comfy boyfriend audio", () => {
  assert.equal(recommendationFor(audios, audios[0], "comforted").id, "call");
});

test("wanted mood prefers a different secret-tier category", () => {
  assert.equal(recommendationFor(audios, audios[0], "wanted").id, "secret");
});

test("part2 mood prefers matching category or voice actor", () => {
  assert.equal(recommendationFor(audios, audios[1], "part2").id, "secret");
});
