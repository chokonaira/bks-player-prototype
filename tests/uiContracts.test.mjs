import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const count = (source, needle) => source.split(needle).length - 1;

test("mobile navigation remains mobile-only and desktop navigation remains desktop-only", () => {
  assert.match(read("components/BottomNav.tsx"), /md:hidden/);
  assert.match(read("components/TopNav.tsx"), /hidden[\s\S]*md:block/);
  assert.match(read("components/TopNav.tsx"), /rounded-full bg-coral\/10/);
});

test("desktop library views use wider shell and lg grids", () => {
  assert.match(read("app/layout.tsx"), /max-w-6xl/);
  assert.match(read("components/AudioShelf.tsx"), /lg:grid-cols-5/);
  assert.match(read("app/browse/page.tsx"), /lg:grid-cols-5/);
  assert.match(read("app/favorites/page.tsx"), /lg:grid-cols-5/);
  assert.match(read("app/downloads/page.tsx"), /lg:grid-cols-5/);
  assert.match(read("components/Discovery.tsx"), /lg:flex-wrap/);
});

test("grid cards fill mobile columns while home shelves expand per segment", () => {
  const audioCard = read("components/AudioCard.tsx");
  const audioShelf = read("components/AudioShelf.tsx");
  assert.match(audioCard, /layout = "grid"/);
  assert.match(audioCard, /layout\?: "grid" \| "rail"/);
  assert.match(audioCard, /layout === "rail" \? "w-40 shrink-0 md:w-48 lg:w-full" : "w-full"/);
  assert.match(audioShelf, /initialMobileCount = 2/);
  assert.match(audioShelf, /audios\.slice\(0, initialDesktopCount\)/);
  assert.match(audioShelf, /grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5/);
  assert.match(audioShelf, /md:hidden/);
  assert.match(audioShelf, /common\.viewAll/);
  assert.equal(count(read("app/page.tsx"), "<AudioShelf"), 2);
});

test("browse mood tiles use a clean mobile mosaic", () => {
  const discovery = read("components/Discovery.tsx");
  assert.match(discovery, /CATEGORY_ORDER/);
  assert.match(discovery, /MOOD_BACKDROPS/);
  assert.match(discovery, /moodTileLayout/);
  assert.match(discovery, /col-span-2 aspect-\[2\.08\/1\]/);
  assert.match(discovery, /grid grid-cols-2 gap-2\.5 md:grid-cols-3/);
  assert.match(discovery, /rounded-lg bg-gradient-to-br/);
});

test("home includes a functional featured listen panel", () => {
  const home = read("app/page.tsx");
  const featured = read("components/FeaturedListenPanel.tsx");
  const player = read("components/PlayerProvider.tsx");
  assert.match(home, /<FeaturedListenPanel \/>/);
  assert.match(featured, /usePlayer\(\)/);
  assert.match(featured, /play\(featuredAudio\)/);
  assert.match(featured, /selectAudio\(audio\.id\)/);
  assert.match(featured, /home\.listenFree/);
  assert.match(player, /AUDIOS\[\(idx \+ 1\) % AUDIOS\.length\]/);
  assert.match(player, /el\.play\(\)\.then\(\(\) => setPlaying\(true\)\)/);
});

test("community page presents a live hub with voting and ideas", () => {
  const community = read("app/community/page.tsx");
  assert.match(community, /community\.liveRoom/);
  assert.match(community, /community\.members/);
  assert.match(community, /community\.feedNote/);
  assert.match(community, /setVoted\(o\.id\)/);
  assert.match(community, /addIdea\(\{ text, author: "You"/);
  assert.match(community, /lg:grid-cols-\[minmax\(0,1fr\)_380px\]/);
});

test("desktop mini-player is floating and sticky artwork has animated handoff classes", () => {
  const mini = read("components/MiniPlayer.tsx");
  const css = read("app/globals.css");
  const afterglow = read("components/AfterglowPanel.tsx");
  assert.match(mini, /md:left-auto/);
  assert.match(mini, /md:right-6/);
  assert.match(mini, /md:w-\[440px\]/);
  assert.match(mini, /lg:grid-cols-\[minmax\(360px,480px\)_minmax\(440px,560px\)\]/);
  assert.match(mini, /matchMedia\("\(min-width: 1024px\)"\)/);
  assert.match(mini, /document\.body\.style\.overflow = "hidden"/);
  assert.match(mini, /overscroll-y-contain/);
  assert.match(mini, /lg:text-5xl/);
  assert.match(mini, /player-art-shell/);
  assert.match(css, /\.player-art-shell/);
  assert.match(css, /height 480ms cubic-bezier/);
  assert.match(css, /min\(480px, calc\(100vh - 8rem\)\)/);
  assert.match(afterglow, /afterglow-callout/);
  assert.match(afterglow, /Sparkles/);
  assert.match(css, /@keyframes afterglow-attention/);
});

test("afterglow, sleep ritual, and moments copy exists for every locale", () => {
  const i18n = read("lib/i18n.ts");
  for (const key of [
    '"afterglow.title"',
    '"afterglow.keepListening"',
    '"player.sleepActive"',
    '"player.cancel"',
    '"home.featuredTitle"',
    '"home.listenFree"',
    '"common.viewAll"',
    '"common.hide"',
    '"community.liveRoom"',
    '"community.members"',
    '"community.votesShort"',
    '"community.ideasShort"',
    '"community.feedNote"',
    '"fav.audios"',
    '"fav.viewAll"',
    '"fav.hide"',
    '"moments.title"',
    '"moments.save"',
    '"moments.saved"',
    '"moments.viewAll"',
    '"moments.hide"',
  ]) {
    assert.equal(count(i18n, key), 3, `${key} should be translated in en/es/fr`);
  }
});

test("moment hearts are saved from the player and surfaced in favorites", () => {
  const moments = read("lib/useMoments.ts");
  assert.match(moments, /bks-moments/);
  assert.match(moments, /DEFAULT_MOMENT/);
  assert.match(moments, /demo-moment-539-94/);
  assert.match(read("components/MiniPlayer.tsx"), /addMoment\(p\.current!\.id, p\.time\)/);
  assert.match(read("app/favorites/page.tsx"), /moments\.slice\(0, 2\)/);
  assert.match(read("app/favorites/page.tsx"), /moments\.viewAll/);
});

test("favorites caps saved audios and expands into a scrollable grid", () => {
  const favoritesPage = read("app/favorites/page.tsx");
  assert.match(favoritesPage, /favorites\.slice\(0, 4\)/);
  assert.match(favoritesPage, /visibleFavorites\.map/);
  assert.match(favoritesPage, /max-h-\[min\(72vh,760px\)\] overflow-y-auto/);
  assert.match(favoritesPage, /fav\.viewAll/);
});

test("continue listening is backed by persisted playback progress", () => {
  assert.match(read("lib/playbackProgress.ts"), /bks-playback-progress/);
  assert.match(read("lib/playbackProgress.ts"), /bks-playback-cleared/);
  assert.match(read("components/PlayerProvider.tsx"), /saveProgress\(cur\.id, el\.currentTime, el\.duration\)/);
  assert.match(read("components/PlayerProvider.tsx"), /clearProgress\(cur\.id\)/);
  assert.match(read("components/ContinueListeningRail.tsx"), /getContinueAudios\(AUDIOS\)/);
});
