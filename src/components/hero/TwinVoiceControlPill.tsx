import type { PointerEvent } from "react";
import type { TwinSpeechController } from "@/hooks/useTwinSpeech";

type TwinVoiceControlPillProps = {
  speech: TwinSpeechController;
};

function stopPointerPropagation(event: PointerEvent<HTMLDivElement>) {
  event.stopPropagation();
}

export function TwinVoiceControlPill({ speech }: TwinVoiceControlPillProps) {
  if (!speech.isSpeaking) return null;

  const buttonClass =
    "grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan sm:size-8";

  return (
    <div
      className="absolute left-1/2 top-[calc(50%+3.4rem)] z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-panel-border/80 bg-background/82 p-1 shadow-[0_0_22px_rgba(34,211,238,.1)] backdrop-blur-md sm:left-[calc(50%+2.9rem)] sm:top-[calc(50%+2.2rem)] sm:translate-x-0"
      role="group"
      aria-label="Digital twin voice controls"
      onPointerDown={stopPointerPropagation}
      onPointerMove={stopPointerPropagation}
      onPointerUp={stopPointerPropagation}
      onClick={(event) => event.stopPropagation()}
    >
      <span
        className={`grid size-10 place-items-center rounded-full text-accent-cyan sm:size-8 ${speech.isPaused ? "opacity-55" : "animate-pulse motion-reduce:animate-none"}`}
        role="status"
        aria-label={speech.isPaused ? "Digital twin speech paused" : "Digital twin speaking"}
        title={speech.isPaused ? "Speech paused" : "Speaking"}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4M9 21h6" />
        </svg>
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={speech.isPaused ? speech.resumeSpeech : speech.pauseSpeech}
        aria-label={speech.isPaused ? "Resume digital twin speech" : "Pause digital twin speech"}
        title={speech.isPaused ? "Resume" : "Pause"}
      >
        {speech.isPaused ? (
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7Z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM14 5h4v14h-4z" /></svg>
        )}
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={speech.stopSpeech}
        aria-label="Stop digital twin speech"
        title="Stop"
      >
        <span className="size-2.5 rounded-[2px] bg-current" aria-hidden="true" />
      </button>
    </div>
  );
}
