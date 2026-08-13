"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resetTwinSpeechAnimation, twinSpeechAnimation } from "@/lib/twin-speech-animation";

type ActiveSpeech = {
  abortController: AbortController;
  analyser?: AnalyserNode;
  animationFrame?: number;
  source?: AudioBufferSourceNode;
};

export function useTwinSpeech() {
  const [muted, setMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mutedRef = useRef(false);
  const contextRef = useRef<AudioContext | null>(null);
  const activeRef = useRef<ActiveSpeech | null>(null);

  const stop = useCallback(() => {
    const active = activeRef.current;
    if (active?.animationFrame) cancelAnimationFrame(active.animationFrame);
    active?.abortController.abort();
    try { active?.source?.stop(); } catch { /* already stopped */ }
    active?.source?.disconnect();
    active?.analyser?.disconnect();
    activeRef.current = null;
    resetTwinSpeechAnimation();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const unlock = useCallback(async () => {
    contextRef.current ??= new AudioContext();
    if (contextRef.current.state === "suspended") await contextRef.current.resume();
  }, []);

  const speak = useCallback(async (text: string): Promise<boolean> => {
    stop();
    if (mutedRef.current || !text.trim()) return false;

    const abortController = new AbortController();
    activeRef.current = { abortController };
    try {
      await unlock();
      const response = await fetch("/api/twin-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: abortController.signal,
      });
      if (!response.ok || !response.body || abortController.signal.aborted) return false;

      const context = contextRef.current;
      if (!context) return false;
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      if (abortController.signal.aborted) return false;

      const source = context.createBufferSource();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.76;
      source.buffer = buffer;
      source.connect(analyser);
      analyser.connect(context.destination);
      activeRef.current = { abortController, analyser, source };
      twinSpeechAnimation.speaking = true;
      setIsSpeaking(true);
      setIsPaused(false);

      const samples = new Uint8Array(analyser.frequencyBinCount);
      let smoothedLevel = 0;
      const analyse = () => {
        analyser.getByteFrequencyData(samples);
        const energy = samples.reduce((sum, value) => sum + value, 0) / samples.length / 255;
        const target = context.state === "suspended"
          ? 0
          : Math.max(0, Math.min(1, (energy - 0.035) * 4.2));
        smoothedLevel += (target - smoothedLevel) * (target > smoothedLevel ? 0.28 : 0.16);
        twinSpeechAnimation.audioLevel = smoothedLevel;
        if (activeRef.current?.source === source) {
          activeRef.current.animationFrame = requestAnimationFrame(analyse);
        }
      };
      source.onended = () => {
        if (activeRef.current?.source === source) stop();
      };
      source.start();
      analyse();
      return true;
    } catch {
      if (!abortController.signal.aborted) resetTwinSpeechAnimation();
      return false;
    }
  }, [stop, unlock]);

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      mutedRef.current = next;
      if (next) stop();
      return next;
    });
  }, [stop]);

  const pauseSpeech = useCallback(async () => {
    if (!activeRef.current?.source || !contextRef.current || isPaused) return;
    await contextRef.current.suspend();
    twinSpeechAnimation.speaking = false;
    twinSpeechAnimation.audioLevel = 0;
    setIsPaused(true);
  }, [isPaused]);

  const resumeSpeech = useCallback(async () => {
    if (!activeRef.current?.source || !contextRef.current || !isPaused) return;
    await contextRef.current.resume();
    twinSpeechAnimation.speaking = true;
    setIsPaused(false);
  }, [isPaused]);

  useEffect(() => () => {
    stop();
    void contextRef.current?.close();
  }, [stop]);

  return {
    isPaused,
    isSpeaking,
    muted,
    pauseSpeech,
    resumeSpeech,
    speak,
    stopSpeech: stop,
    toggleMuted,
    unlock,
  };
}

export type TwinSpeechController = ReturnType<typeof useTwinSpeech>;
