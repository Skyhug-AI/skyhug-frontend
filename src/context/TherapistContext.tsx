import React, { createContext, useState, useContext, useCallback } from 'react';

interface TherapistContextProps {
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (enabled: boolean) => void;
  fetchAndPlayTtsAudio: (tts_path: string) => Promise<HTMLAudioElement | null>;
  playTtsAudio: (tts_path: string) => Promise<void>;
}

const TherapistContext = createContext<TherapistContextProps | undefined>(undefined);

interface TherapistProviderProps {
  children: React.ReactNode;
}

const TherapistProvider: React.FC<TherapistProviderProps> = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);

  const fetchAndPlayTtsAudio = useCallback(async (tts_path: string): Promise<HTMLAudioElement | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tts-audio/${tts_path}`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const audio = new Audio();
      const pcmData = audioBuffer.getChannelData(0);
      const wavData = convertToWave(pcmData, audioBuffer.sampleRate);
      const blob = new Blob([wavData], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);
      audio.src = audioUrl;

      return audio;
    } catch (error) {
      console.error("Error fetching or playing TTS audio:", error);
      return null;
    }
  }, []);

  const playTtsAudio = async (tts_path: string): Promise<void> => {
    try {
      const audio = await fetchAndPlayTtsAudio(tts_path);
      if (audio) {
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing TTS audio:", error);
    }
  };

  const convertToWave = (pcmData: Float32Array, sampleRate: number): ArrayBuffer => {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = pcmData.length * (bitsPerSample / 8);
    const buffer = new ArrayBuffer(44 + dataSize);
    const dataView = new DataView(buffer);

    /* RIFF identifier */
    writeString(dataView, 0, 'RIFF');
    /* RIFF size */
    dataView.setUint32(4, 36 + dataSize, true);
    /* RIFF type */
    writeString(dataView, 8, 'WAVE');
    /* format chunk identifier */
    writeString(dataView, 12, 'fmt ');
    /* format chunk byte count */
    dataView.setUint32(16, 16, true);
    /* format tag (PCM) */
    dataView.setUint16(20, 1, true);
    /* number of channels */
    dataView.setUint16(22, numChannels, true);
    /* sample rate */
    dataView.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    dataView.setUint32(28, byteRate, true);
    /* block align (number of bytes per sample) */
    dataView.setUint16(32, blockAlign, true);
    /* bits per sample */
    dataView.setUint16(34, bitsPerSample, true);
    /* data chunk identifier */
    writeString(dataView, 36, 'data');
    /* data chunk byte count */
    dataView.setUint32(40, dataSize, true);

    floatTo16BitPCM(dataView, 44, pcmData);

    return buffer;
  }

  const writeString = (dataView: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      dataView.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const floatTo16BitPCM = (dataView: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  return (
    <TherapistContext.Provider value={{ isVoiceEnabled, setIsVoiceEnabled, fetchAndPlayTtsAudio, playTtsAudio }}>
      {children}
    </TherapistContext.Provider>
  );
};

const useTherapist = (): TherapistContextProps => {
  const context = useContext(TherapistContext);
  if (context === undefined) {
    throw new Error("useTherapist must be used within a TherapistProvider");
  }
  return context;
};

export { TherapistProvider, useTherapist };
