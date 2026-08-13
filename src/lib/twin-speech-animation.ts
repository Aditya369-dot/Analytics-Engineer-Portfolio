export type TwinSpeechAnimationState = {
  speaking: boolean;
  audioLevel: number;
};

export const twinSpeechAnimation: TwinSpeechAnimationState = {
  speaking: false,
  audioLevel: 0,
};

export function resetTwinSpeechAnimation() {
  twinSpeechAnimation.speaking = false;
  twinSpeechAnimation.audioLevel = 0;
}
