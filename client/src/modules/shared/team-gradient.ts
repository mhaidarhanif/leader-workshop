import type { CSSProperties } from 'react';

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function teamGradientStyle(teamName: string): CSSProperties {
  const hash = hashString(teamName.toLowerCase());
  const hue1 = hash % 360;
  const hue2 = (hash * 7 + 137) % 360;
  const hue3 = (hash * 13 + 73) % 360;

  return {
    background: `linear-gradient(135deg, hsl(${hue1} 65% 45%), hsl(${hue2} 70% 55%), hsl(${hue3} 60% 40%))`,
  };
}
