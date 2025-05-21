import React, { useState, useEffect, useCallback, useRef } from 'react';
import PulsatingMicButton from './PulsatingMicButton';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';
import { useToast } from '@/hooks/use-toast';

type VoiceRecorderProps = {
  onVoiceRecorded: (transcript: string) => void;
  isDisabled?: boolean;
  shouldPauseRecognition?: boolean;
  onRecognitionPaused?: () => void;
  onRecognitionResumed?: () => void;
  onInterruptPlayback?: () => void;  
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onVoiceRecorded,
  isDisabled = false,
  shouldPauseRecognition = false,
  onRecognitionPaused,
  onRecognitionResumed,
  onInterruptPlayback, 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [lastSpeechTime, setLastSpeechTime] = useState<number>(0);
  const [hasSpeechStarted, setHasSpeechStarted] = useState(false);
  const [recognitionManuallyPaused, setRecognitionManuallyPaused] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const silenceSentRef = useRef(false);
  const cleanupVadRef = useRef<() => void>()
  const prevRecordingRef = useRef(isRecording)
  const finalSegments = useRef<string[]>([]);

  const handleVoiceActivity = useCallback((isSpeaking: boolean, volume: number) => {
    //console.log(`[VAD] speaking=${isSpeaking} volume=${volume.toFixed(3)}`);
    if (isSpeaking) {
      setHasSpeechStarted(true);
      setLastSpeechTime(Date.now());
    }
  }, []);

  const { initVoiceDetection } = useVoiceDetection(handleVoiceActivity, 0.05);

  useEffect(() => {
    let silenceTimeout: NodeJS.Timeout;
    if (isRecording && hasSpeechStarted && lastSpeechTime > 0) {
      console.log('⌛ starting silence timer (1s)');
      silenceTimeout = setTimeout(() => {
        const delta = Date.now() - lastSpeechTime;
        console.log(`⌛ silence check: ${delta}ms since last speech`);
        if (delta > 1000 && !silenceSentRef.current) {
          const trimmed = transcript.trim();
          if (trimmed) {
            console.log('✋ silence detected—sending transcript:', trimmed);
            silenceSentRef.current = true;
  
            // 1) Send the transcript
            onVoiceRecorded(trimmed);
  
            // 2) Tear down recognition
            pauseRecognition();
  
            // 3) *Immediately* notify parent that ASR is now paused
            if (onRecognitionPaused) {
              onRecognitionPaused();
            }
          }
        }
      }, 1000);
    }
    return () => clearTimeout(silenceTimeout);
  }, [lastSpeechTime, isRecording, hasSpeechStarted, transcript, onVoiceRecorded, onRecognitionPaused]);
  

  useEffect(() => {
    if ((isDisabled || shouldPauseRecognition) && isRecording) {
      pauseRecognition();
    } else if (!isDisabled && !shouldPauseRecognition && recognitionManuallyPaused) {
      resumeRecognition();
    }
  }, [isDisabled, shouldPauseRecognition]);
  
  useEffect(() => {
    // On mount, if we're allowed to listen, go through resumeRecognition()
    if (!isDisabled && !shouldPauseRecognition && !isRecording) {
      resumeRecognition();
    }
  }, []);

  useEffect(() => {
    // if we *were* recording, and now we're *not*, fire the paused callback
    if (prevRecordingRef.current && !isRecording) {
      onRecognitionPaused?.()
    }
    prevRecordingRef.current = isRecording
  }, [isRecording, onRecognitionPaused])

  const initializeRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = async () => {
        console.log('⏺️ ASR started');
        setIsRecording(true);
      
        // kick off VAD and keep its cleanup fn
        cleanupVadRef.current = await initVoiceDetection();
        finalSegments.current = [];
        setTranscript('');
        setLastSpeechTime(Date.now());
        setHasSpeechStarted(false);
      
        setRecognitionManuallyPaused(false);
        onRecognitionResumed?.();
      };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let sawSomething = false;

      // collect any newly-finalized bits
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        console.log(`[ASR] result #${i}: isFinal=${result.isFinal}`, result[0].transcript);
        if (result.isFinal) {
          finalSegments.current.push(result[0].transcript);
          setLastSpeechTime(Date.now());
          sawSomething = true;
        }
      }

      // grab the most recent interim (if there is one)
      const last = event.results[event.results.length - 1];
      const interim = last.isFinal ? '' : last[0].transcript;

      if (interim) {
        sawSomething = true;
        // (we don’t bump lastSpeechTime here – that stays for final only)
      }

      // as soon as we see any ASR data, mark speech started
      if (sawSomething) {
        setHasSpeechStarted(true);
      }

      // update the transcript state
      const full = finalSegments.current.join('') + interim;
      console.log('[ASR] full transcript:', full);
      setTranscript(full);
    };


      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // if the engine times out for no-speech, send whatever we have
        if (event.error === 'no-speech') {
          console.log('🚫 engine no-speech; final transcript:', transcript);
          const trimmed = transcript.trim();
          if (trimmed && !silenceSentRef.current) {
            silenceSentRef.current = true;
            console.log('✋ onerror no-speech → sending transcript', trimmed);
            onVoiceRecorded(trimmed);
          }
          pauseRecognition();
          return;
        }

        // any other error, just bail
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        setRecognitionManuallyPaused(false);
      };
      

      recognition.onend = () => {
        console.log('🔇 ASR onend, final transcript:', transcript);
        const trimmed = transcript.trim();
        if (trimmed && !silenceSentRef.current) {
          silenceSentRef.current = true;
          console.log('✋ onend → sending transcript', trimmed);
          onVoiceRecorded(trimmed);
        }
        setIsRecording(false);
        setRecognitionManuallyPaused(true);
        onRecognitionPaused?.();
      };
      
      

      return recognition;
    }
    return null;
  };

  const startRecording = async () => {
    // before you request the mic…
    silenceSentRef.current = false;
    if (isDisabled || shouldPauseRecognition) return;
    try {
      if (!mediaStreamRef.current) {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }
      const recognition = initializeRecognition();
      if (recognition) {
        if (recognitionInstance) {
          recognitionInstance.stop();
        }
        recognition.start();
        setRecognitionInstance(recognition);
      } else {
        console.error('Speech recognition not supported in this browser');
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const pauseRecognition = () => {
    // tear down VAD…
    cleanupVadRef.current?.();
    cleanupVadRef.current = undefined;

    if (recognitionInstance) {
      // remove handlers so abort() doesn’t fire onerror/onend
      recognitionInstance.onerror = null;
      recognitionInstance.onend = null;
      // abort immediately without triggering the no-speech error
      recognitionInstance.abort();
    }

    setIsRecording(false);
    setRecognitionManuallyPaused(true);
    onRecognitionPaused?.();
  };
  
  const resumeRecognition = () => {
    silenceSentRef.current = false;
    if (recognitionInstance && !isRecording) {
      recognitionInstance.onend = null;
      recognitionInstance.stop();
      setTimeout(() => {
        recognitionInstance.onend = () => {
          if (!isDisabled && !shouldPauseRecognition && recognitionManuallyPaused) {
            setIsRecording(false);
          }
        };
        recognitionInstance.start();
        setIsRecording(true);
        setRecognitionManuallyPaused(false);
        if (onRecognitionResumed) onRecognitionResumed();
      }, 150);
    } else {
      startRecording();
    }
  };

  const stopRecording = () => {
    if (recognitionInstance) {
      recognitionInstance.onend = null;
      recognitionInstance.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    setHasSpeechStarted(false);
    setRecognitionManuallyPaused(false);
  };

  const toggleRecording = () => {
    if (shouldPauseRecognition && onInterruptPlayback) {
      // skip the TTS…
      onInterruptPlayback();
  
      // now manually resume (not start) the same session
      resumeRecognition();
      return;
    }
  
    if (isRecording) {
      // user is explicitly pausing
      pauseRecognition();
    } else {
      // user is explicitly starting or resuming
      resumeRecognition();
    }
  };
  

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionInstance) {
        recognitionInstance.onend = null;
        recognitionInstance.stop();
      }
    };
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center py-4">
      <PulsatingMicButton
        isRecording={isRecording}
        onClick={toggleRecording}
        disabled={isDisabled }
      />
    </div>
  );
};

export default VoiceRecorder;
