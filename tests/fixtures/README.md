# Community test fixtures

These records and media are only for automated development checks. They are not imported by the production application and do not describe real community activities.

`clip.webm` is MDN's CC0 flower sample, downloaded from https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm on 11 November 2026. This copy tests browser decoding and playback only. A separately labelled public demo copy now lives under `public/community-demo/`, with its own matching descriptive captions and transcript. `captions.vtt` here is a synthetic test caption, not a transcript of that sample. The harness's transcript, dates, titles, and registration URLs are explicitly labelled test fixtures.

Open `/tests/fixtures/community.html` on Vite, then select **Open fixture hub**, to inspect all populated views without adding fabricated records to the public collection. This HTML entry and the video are outside `public/` and are not copied into `dist/`.
