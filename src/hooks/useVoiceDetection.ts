export const useVoiceDetection = (
  callback: (isSpeaking: boolean, volumeLevel?: number) => void,
  threshold = 0.01
) => {
  let rafId: number
  let audioContext: AudioContext
  let stream: MediaStream

  const initVoiceDetection = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }})
      audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.6
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a,v) => a+v, 0)/dataArray.length
        const dampened = (average/256)*0.7
        callback(dampened > threshold, dampened)
        rafId = requestAnimationFrame(checkAudioLevel)
      }
      rafId = requestAnimationFrame(checkAudioLevel)

      // **return this cleanup fn** so caller can stop both VAD loop and close the context
      return () => {
        cancelAnimationFrame(rafId)
        analyser.disconnect()
        source.disconnect()
        stream.getTracks().forEach(t => t.stop())
        if (audioContext.state !== "closed") {
          audioContext.close().catch(() => {/* swallow */})
        }
      }
    } catch (err) {
      console.error("useVoiceDetection init error", err)
    }
  }

  return { initVoiceDetection }
}
