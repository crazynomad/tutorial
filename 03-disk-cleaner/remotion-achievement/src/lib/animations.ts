import { interpolate, spring } from "remotion";

export const springConfig = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 8 },
  heavy: { damping: 15, stiffness: 80, mass: 2 },
};

export function fadeIn(frame: number, startFrame: number, duration: number) {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function slideUp(frame: number, startFrame: number, duration: number) {
  return interpolate(frame, [startFrame, startFrame + duration], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function springScale(
  frame: number,
  fps: number,
  delay: number = 0,
  config = springConfig.bouncy
) {
  return spring({
    frame: frame - delay,
    fps,
    config,
  });
}

export function countUp(
  frame: number,
  startFrame: number,
  endFrame: number,
  targetValue: number
) {
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Easing for slow-down effect at the end
  const eased = 1 - Math.pow(1 - progress, 3);
  return targetValue * eased;
}

export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}
