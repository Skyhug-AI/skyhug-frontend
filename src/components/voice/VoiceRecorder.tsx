
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import PulsatingMicButton from './PulsatingMicButton';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';
import { useToast } from '@/hooks/use-toast';

type VoiceRecorderProps = {
  onVoiceRecorded: (transcript: string) => void;
  isDisabled?: boolean;
  shouldPauseRecognition?: boolean;
  onRecognitionPaused?: () => void;
  onRecognitionResumed?: () => void;
  onMicStateChange?: (micOn: boolean) => void;
  onRecognitionStateChange?: (recognizing: boolean) => void;
};

export type VoiceRecorderHandle = {
  resumeRecognition: () => void;
  pauseRecognition: () => void;
  isRecording: () => boolean;
  isMicOn: () => boolean;
};

const VoiceRecorder = forwardRef<VoiceRecorderHandle, VoiceRecorderProps>(({
  onVoiceRecorded,
  isDisabled = false,
  shouldPauseRecognition = false,
  onRecognitionPaused,
  onRecognitionResumed,
  onMicStateChange,
  onRecognitionStateChange
}, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [lastSpeechTime, setLastSpeechTime] = useState<number>(0);
  const [hasSpeechStarted, setHasSpeechStarted] = useState(false);
  const [recognitionManuallyPaused, setRecognitionManuallyPaused] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Notify parent when mic or recognition state changes (for indicator)
  useEffect(() => {
    if (onMicStateChange) onMicStateChange(micOn);
  }, [micOn, onMicStateChange]);

  useEffect(() => {
    if (onRecognitionStateChange) onRecognitionStateChange(recognizing);
  }, [recognizing, onRecognitionStateChange]);

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
        if (Date.now() - lastSpeechTime > 2000) {
          if (transcript.trim()) {
            onVoiceRecorded(transcript);
            setTranscript('');
            setHasSpeechStarted(false);
          }
        }
      }, 2000);
    }
    return () => {
      clearTimeout(silenceTimeout);
    };
  }, [lastSpeechTime, isRecording, hasSpeechStarted, transcript, onVoiceRecorded]);

  useEffect(() => {
    if ((isDisabled || shouldPauseRecognition) && isRecording) {
      pauseRecognition();
    } else if (!isDisabled && !shouldPauseRecognition && recognitionManuallyPaused) {
      resumeRecognition();
    }
    // eslint-disable-next-line
  }, [isDisabled, shouldPauseRecognition]);

  const initializeRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecognizing(true);
        setTranscript('');
        setLastSpeechTime(Date.now());
        setHasSpeechStarted(false);
        initVoiceDetection();
        toast({
          title: "Recording started",
          description: "Speak naturally. Your message will be sent automatically after you finish speaking.",
          duration: 3000,
        });
        setRecognitionManuallyPaused(false);
        setMicOn(true);
        if (onRecognitionResumed) onRecognitionResumed();
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
        if (event.error === 'no-speech') {
          return;
        }
        setIsRecording(false);
        setRecognizing(false);
        setRecognitionManuallyPaused(false);
        setMicOn(false);
        toast({
          title: "Recording error",
          description: "There was an error with the voice recording",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setRecognizing(false);
        if (isRecording && !isDisabled && !recognitionManuallyPaused) {
          recognition.start();
        } else {
          setIsRecording(false);
        }
      };

      return recognition;
    }
    return null;
  };

  const startRecording = async () => {
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
        setMicOn(true);
      }
      const recognition = initializeRecognition();
      if (recognition) {
        if (recognitionInstance) {
          recognitionInstance.stop();
        }
        recognition.start();
        setRecognitionInstance(recognition);
      } else {
        setMicOn(false);
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in your browser",
          variant: "destructive",
        });
      }
    } catch (error) {
      setMicOn(false);
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone error",
        description: "Could not access the microphone",
        variant: "destructive",
      });
    }
  };

  const pauseRecognition = () => {
    if (recognitionInstance) {
      recognitionInstance.onend = null;
      recognitionInstance.stop();
      setRecognizing(false);
      setIsRecording(false);
      setRecognitionManuallyPaused(true);
      if (onRecognitionPaused) onRecognitionPaused();
    }
  };

  const resumeRecognition = () => {
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
        setRecognizing(true);
        setRecognitionManuallyPaused(false);
        setMicOn(true);
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
    setRecognizing(false);
    setHasSpeechStarted(false);
    setMicOn(false);
    setRecognitionManuallyPaused(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      pauseRecognition();
    } else {
      startRecording();
    }
  };

  useImperativeHandle(ref, () => ({
    resumeRecognition,
    pauseRecognition,
    isRecording: () => isRecording,
    isMicOn: () => micOn,
  }), [isRecording, micOn]);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionInstance) {
        recognitionInstance.onend = null;
        recognitionInstance.stop();
      }
      setMicOn(false);
      setRecognizing(false);
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
});

export default VoiceRecorder;

