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



  const handleVoiceActivity = useCallback((isSpeaking: boolean) => {
    if (isSpeaking) {
      setHasSpeechStarted(true);
      setLastSpeechTime(Date.now());
    }
  }, []);

  const { initVoiceDetection } = useVoiceDetection(handleVoiceActivity, 0.1);

  useEffect(() => {
    let silenceTimeout: NodeJS.Timeout;
    if (isRecording && hasSpeechStarted && lastSpeechTime > 0) {
      silenceTimeout = setTimeout(() => {
        if (Date.now() - lastSpeechTime > 2000 && !silenceSentRef.current) {
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
      }, 2000);
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
  
    setTranscript('');
    setLastSpeechTime(Date.now());
    setHasSpeechStarted(false);
  
    toast({
      title: "Recording started",
      description:
        "Speak naturally. Your message will be sent automatically after you finish speaking.",
      duration: 3000,
    });
  
    setRecognitionManuallyPaused(false);
    onRecognitionResumed?.();
  };
  

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript = event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
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
    // 1) tear down your voice-activity-detection
    cleanupVadRef.current?.();
    cleanupVadRef.current = undefined;
  
    // 2) stop the SpeechRecognition instance
    if (recognitionInstance) {
      recognitionInstance.onend = null;
      recognitionInstance.stop();
    }
  
    // 3) update UI state & notify parent
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
        disabled={isDisabled || shouldPauseRecognition}
      />
    </div>
  );
};

export default VoiceRecorder;
