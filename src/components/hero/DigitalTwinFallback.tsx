type DigitalTwinFallbackProps = {
  fallbackImage?: string;
};

export function DigitalTwinFallback({ fallbackImage }: DigitalTwinFallbackProps) {
  if (fallbackImage) {
    return (
      <div
        className="h-full w-full bg-contain bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${fallbackImage})` }}
        role="img"
        aria-label="Digital twin fallback asset"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 300 350"
      className="h-full max-h-80 w-full max-w-72"
      role="img"
      aria-label="Abstract holographic human-form placeholder; not a likeness of Aditya"
    >
      <defs>
        <linearGradient id="twin-fallback-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--color-violet-bright)" />
          <stop offset="0.55" stopColor="var(--color-blue-bright)" />
          <stop offset="1" stopColor="var(--color-cyan)" />
        </linearGradient>
        <radialGradient id="twin-fallback-platform">
          <stop offset="0" stopColor="var(--color-cyan)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--color-cyan)" stopOpacity="0" />
        </radialGradient>
        <filter id="twin-fallback-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="150" cy="300" rx="115" ry="34" fill="url(#twin-fallback-platform)" />
      <ellipse cx="150" cy="300" rx="104" ry="24" fill="none" stroke="var(--color-cyan)" strokeOpacity="0.5" />
      <ellipse cx="150" cy="300" rx="70" ry="14" fill="none" stroke="var(--color-violet)" strokeOpacity="0.45" />

      <g fill="none" stroke="url(#twin-fallback-stroke)" filter="url(#twin-fallback-glow)">
        <path d="M150 48c-31 0-51 24-51 58 0 25 10 45 26 56l-7 18c-43 12-67 37-74 92" strokeWidth="1.5" />
        <path d="M150 48c31 0 51 24 51 58 0 25-10 45-26 56l7 18c43 12 67 37 74 92" strokeWidth="1.5" />
        <path d="M100 111c15 9 85 9 100 0M111 138c25 11 53 11 78 0M118 180c21 14 43 20 64 0M69 222c45 17 117 17 162 0M52 260c62 21 134 21 196 0" strokeOpacity="0.45" />
        <path d="M150 50v224M125 162l25 30 25-30M94 194l56 80 56-80" strokeOpacity="0.35" />
      </g>
    </svg>
  );
}
