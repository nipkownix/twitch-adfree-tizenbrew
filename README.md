# Twitch AdFree — TizenBrew

Enhanced Twitch experience for Samsung (Tizen) TVs, delivered as a [TizenBrew](https://github.com/reisxd/TizenBrew) module.

Based on [twitch-adfree-webos](https://github.com/adamff-dev/twitch-adfree-webos) by [@adamff-dev](https://github.com/adamff-dev), ported to Tizen/TizenBrew.

## Installation

Add `nipkownix/twitch-adfree-tizenbrew` as a GitHub module in the TizenBrew module manager.

## Features

- **Ad blocking** — mutes and hides ads automatically
- **Channel points** — auto-claims community points during streams
- **Sub-only VODs** — bypasses subscriber-only VOD restrictions
- **Low latency** — enables low-latency streaming mode
- **Emote support** — loads 7TV and BTTV emotes in chat
- **Chat overlay** — transparent chat on top of video with configurable position, size, and font
- **Performance** — option to disable animations on lower-end devices
- **Auto-accept** — dismisses cookie banners and mature content warnings
- **Navigation shortcuts** — number keys jump to top nav (1 Home, 2 Following, 3 Browse, 4 Search)

Open the settings screen with the **GREEN** button on the remote.

![Settings Screen](screenshots/settings.png)

## Building

```sh
npm install
npm run build
```

Output is written to `dist/userScript.js`.
