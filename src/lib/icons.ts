export const fluentIcons = [
  "arrow-counterclockwise-20-filled",
  "chevron-right-20-filled",
  "pause-20-filled",
  "play-20-filled",
] as const;

export const playbackIcons = {
  play: "fluent:play-20-filled",
  pause: "fluent:pause-20-filled",
  replay: "fluent:arrow-counterclockwise-20-filled",
} as const;

export type PlaybackIconName = keyof typeof playbackIcons;
