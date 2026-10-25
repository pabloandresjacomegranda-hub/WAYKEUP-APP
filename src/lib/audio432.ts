/**
 * 432 Hz pitch-shift utility.
 *
 * Standard audio (TTS, music) is produced at A4=440 Hz. To convert to
 * A4=432 Hz we lower the pitch by a constant ratio. The playback-rate
 * factor is 432/440 ≈ 0.981818, which shifts every frequency down by
 * ~31.77 cents — the standard 432 Hz tuning offset.
 *
 * Two playback paths exist in the app:
 *  - Browser SpeechSynthesis (Web Speech API) — no raw audio buffer, so
 *    we approximate by lowering `utterance.pitch`.
 *  - ElevenLabs TTS / uploaded audio files — returns a Blob/URL we can
 *    decode with the Web Audio API and re-pitch precisely via
 *    playbackRate on an AudioBufferSourceNode.
 */

export const RATIO_432 = 432 / 440;

/**
 * Approximate pitch value for SpeechSynthesisUtterance.pitch (0–2 range).
 * Default speech pitch is 1.0; multiplying by the 432 ratio gives ~0.982.
 */
export const PITCH_432 = RATIO_432;

/**
 * Re-pitch an audio Blob to 432 Hz using the Web Audio API and return
 * a new object URL ready for an <audio> element or Audio() call.
 * Falls back to the original URL if the Web Audio API is unavailable.
 */
export async function blobTo432Url(blob: Blob, fallbackUrl: string): Promise<string> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return fallbackUrl;

    const ctx = new AudioCtx();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    // Render the re-pitched buffer offline for a clean, seekable file.
    const offline = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      Math.ceil(audioBuffer.length / RATIO_432),
      audioBuffer.sampleRate,
    );
    const source = offline.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = RATIO_432;
    source.connect(offline.destination);
    source.start();

    const rendered = await offline.startRendering();
    const wavBlob = audioBufferToWav(rendered);
    return URL.createObjectURL(wavBlob);
  } catch {
    return fallbackUrl;
  }
}

/**
 * Encode an AudioBuffer to a 16-bit PCM WAV Blob.
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) channels.push(buffer.getChannelData(ch));

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}
