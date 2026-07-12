import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const count = (source, needle) => source.split(needle).length - 1;

test("mobile navigation remains mobile-only and desktop navigation remains desktop-only", () => {
  assert.match(read("components/BottomNav.tsx"), /md:hidden/);
  assert.match(read("components/TopNav.tsx"), /hidden[\s\S]*md:block/);
});

test("desktop library views use wider shell and lg grids", () => {
  assert.match(read("app/layout.tsx"), /max-w-6xl/);
  assert.match(read("app/page.tsx"), /lg:grid-cols-5/);
  assert.match(read("app/browse/page.tsx"), /lg:grid-cols-5/);
  assert.match(read("app/favorites/page.tsx"), /lg:grid-cols-5/);
  assert.match(read("app/downloads/page.tsx"), /lg:grid-cols-5/);
  assert.match(read("components/Discovery.tsx"), /lg:flex-wrap/);
});

test("grid cards fill mobile columns while home shelves keep rail sizing", () => {
  const audioCard = read("components/AudioCard.tsx");
  assert.match(audioCard, /layout = "grid"/);
  assert.match(audioCard, /layout\?: "grid" \| "rail"/);
  assert.match(audioCard, /layout === "rail" \? "w-40 shrink-0 md:w-48 lg:w-full" : "w-full"/);
  assert.equal(count(read("app/page.tsx"), 'layout="rail"'), 2);
});

test("desktop mini-player is floating and sticky artwork has animated handoff classes", () => {
  const mini = read("components/MiniPlayer.tsx");
  const css = read("app/globals.css");
  assert.match(mini, /md:left-auto/);
  assert.match(mini, /md:right-6/);
  assert.match(mini, /md:w-\[440px\]/);
  assert.match(mini, /player-art-shell/);
  assert.match(css, /\.player-art-shell/);
  assert.match(css, /height 480ms cubic-bezier/);
});

test("afterglow, sleep ritual, and moments copy exists for every locale", () => {
  const i18n = read("lib/i18n.ts");
  for (const key of [
    '"afterglow.title"',
    '"afterglow.keepListening"',
    '"player.sleepActive"',
    '"player.cancel"',
    '"moments.title"',
    '"moments.save"',
    '"moments.saved"',
  ]) {
    assert.equal(count(i18n, key), 3, `${key} should be translated in en/es/fr`);
  }
});

test("moment hearts are saved from the player and surfaced in favorites", () => {
  assert.match(read("lib/useMoments.ts"), /bks-moments/);
  assert.match(read("components/MiniPlayer.tsx"), /addMoment\(p\.current!\.id, p\.time\)/);
  assert.match(read("app/favorites/page.tsx"), /moments\.slice\(0, 6\)/);
});

test("continue listening is backed by persisted playback progress", () => {
  assert.match(read("lib/playbackProgress.ts"), /bks-playback-progress/);
  assert.match(read("lib/playbackProgress.ts"), /bks-playback-cleared/);
  assert.match(read("components/PlayerProvider.tsx"), /saveProgress\(cur\.id, el\.currentTime, el\.duration\)/);
  assert.match(read("components/PlayerProvider.tsx"), /clearProgress\(cur\.id\)/);
  assert.match(read("components/ContinueListeningRail.tsx"), /getContinueAudios\(AUDIOS\)/);
});
