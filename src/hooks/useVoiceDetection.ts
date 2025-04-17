
export const useVoiceDetection = (
  callback: (isSpeaking: boolean) => void,
  threshold = 0.01
) => {
  const init = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
        const normalizedAverage = average / 256; // Convert to 0-1 range
        callback(normalizedAverage > threshold);
        requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();

      return () => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return { initVoiceDetection: init };
};
