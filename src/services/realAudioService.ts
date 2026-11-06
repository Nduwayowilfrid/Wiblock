// Real Audio Processing Engine using Web Audio API

let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Decodes real user uploaded audio file
 */
export async function decodeAudioFile(file: File): Promise<{ buffer: AudioBuffer; peaks: number[] }> {
  const ctx = getAudioContext();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = await ctx.decodeAudioData(arrayBuffer);

  // Extract 60 peak values for accurate waveform rendering
  const channelData = buffer.getChannelData(0);
  const sampleSize = Math.floor(channelData.length / 60);
  const peaks: number[] = [];

  for (let i = 0; i < 60; i++) {
    const start = i * sampleSize;
    let max = 0;
    for (let j = 0; j < sampleSize; j += 10) {
      const val = Math.abs(channelData[start + j] || 0);
      if (val > max) max = val;
    }
    peaks.push(Math.min(1, max));
  }

  return { buffer, peaks };
}

/**
 * Plays trimmed section of real audio with optional fade in/out
 */
export function playTrimmedAudio(
  buffer: AudioBuffer,
  startTime: number,
  duration: number,
  fadeIn: boolean,
  fadeOut: boolean,
  onEnded?: () => void
) {
  stopAudioPlayback();

  const ctx = getAudioContext();
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gainNode = ctx.createGain();
  const now = ctx.currentTime;

  if (fadeIn) {
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(1, now + 1.2);
  } else {
    gainNode.gain.setValueAtTime(1, now);
  }

  if (fadeOut && duration > 2) {
    gainNode.gain.setValueAtTime(1, now + duration - 1.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
  }

  source.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.onended = () => {
    currentSource = null;
    if (onEnded) onEnded();
  };

  source.start(0, startTime, duration);
  currentSource = source;
}

export function stopAudioPlayback() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch {
      // ignore
    }
    currentSource = null;
  }
}

/**
 * Encodes audio buffer slice to valid WAV audio file blob
 */
export function exportWavSlice(buffer: AudioBuffer, startTime: number, duration: number): Blob {
  const sampleRate = buffer.sampleRate;
  const numChannels = buffer.numberOfChannels;
  const startSample = Math.floor(startTime * sampleRate);
  const numSamples = Math.min(buffer.length - startSample, Math.floor(duration * sampleRate));

  // Interleave channels
  const interleaved = new Float32Array(numSamples * numChannels);
  for (let ch = 0; ch < numChannels; ch++) {
    const channelData = buffer.getChannelData(ch);
    for (let i = 0; i < numSamples; i++) {
      interleaved[i * numChannels + ch] = channelData[startSample + i] || 0;
    }
  }

  // Create WAV header
  const dataByteLength = interleaved.length * 2;
  const wavBuffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataByteLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataByteLength, true);

  // Write PCM 16-bit samples
  let offset = 44;
  for (let i = 0; i < interleaved.length; i++) {
    const s = Math.max(-1, Math.min(1, interleaved[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}
