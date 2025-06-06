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
    //console.log(`[VAD] speaking=${isSpeaking} volume=${volume}`);
    if (isSpeaking) {
      setHasSpeechStarted(true);
      setLastSpeechTime(Date.now());
    }
  }, []);

  const { initVoiceDetection } = useVoiceDetection(handleVoiceActivity, 0.05);

  useEffect(() => {
    let silenceTimeout: NodeJS.Timeout;
    if (isRecording && hasSpeechStarted && lastSpeechTime > 0) {
      silenceTimeout = setTimeout(() => {
        if (Date.now() - lastSpeechTime > 1000 && !silenceSentRef.current) {
          const trimmed = transcript.trim();
          if (trimmed) {
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
          // collect any newly-finalized bits
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalSegments.current.push(result[0].transcript);
        }
      }
      // grab the most recent interim if there is one
      const last = event.results[event.results.length - 1];
      const interim = last.isFinal ? '' : last[0].transcript;

      const full = finalSegments.current.join('') + interim;
      setTranscript(full);
        setLastSpeechTime(Date.now());
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
      
        // Treat “no-speech” as an intentional stop:
        if (event.error === 'no-speech') {
          // this will stop the recognizer, flip your flags, and fire onRecognitionPaused()
          pauseRecognition();
          return;
        }
      
        // for any other errors, fall back to your existing error UI
        setIsRecording(false);
        setRecognitionManuallyPaused(false);
        toast({
          title: "Recording error",
          description: "There was an error with the voice recording",
          variant: "destructive",
        });
      };
      

      recognition.onend = () => {
        setIsRecording(false);
        setRecognitionManuallyPaused(true);
        if (onRecognitionPaused) onRecognitionPaused();
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
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in your browser",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone error",
        description: "Could not access the microphone",
        variant: "destructive",
      });
    }
  };

  const pauseRecognition = () => {
    // tear down VAD…
    cleanupVadRef.current?.()
    cleanupVadRef.current = undefined
  
    if (recognitionInstance) {
      recognitionInstance.onend = null
      recognitionInstance.stop()
    }
  
    setIsRecording(false)
    setRecognitionManuallyPaused(true)
    onRecognitionPaused?.()
  }
  
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
