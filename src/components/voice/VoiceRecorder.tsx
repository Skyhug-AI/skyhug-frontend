
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PulsatingMicButton from './PulsatingMicButton';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';
import { useToast } from '@/hooks/use-toast';

type VoiceRecorderProps = {
  onVoiceRecorded: (transcript: string) => void;
  isDisabled?: boolean;
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onVoiceRecorded, isDisabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [lastSpeechTime, setLastSpeechTime] = useState<number>(0);
  const [hasSpeechStarted, setHasSpeechStarted] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  
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
    if (isDisabled && isRecording) {
      pauseRecognition();
    }
  }, [isDisabled]);

  const initializeRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('');
        setLastSpeechTime(Date.now());
        setHasSpeechStarted(false);
        initVoiceDetection();
        toast({
          title: "Recording started",
          description: "Speak naturally. Your message will be sent automatically after you finish speaking.",
          duration: 3000,
        });
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
        toast({
          title: "Recording error",
          description: "There was an error with the voice recording",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        if (isRecording && !isDisabled) {
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
    if (isDisabled) return;
    
    try {
      // Get or reuse media stream
      if (!mediaStreamRef.current) {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }
      
      // Initialize and start recognition
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
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsRecording(false);
      // Note: we don't clear mediaStreamRef here
    }
  };

  const stopRecording = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    setHasSpeechStarted(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      pauseRecognition();
    } else {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center py-4">
      <PulsatingMicButton
        isRecording={isRecording}
        onClick={toggleRecording}
        disabled={isDisabled}
      />
    </div>
  );
};

export default VoiceRecorder;

