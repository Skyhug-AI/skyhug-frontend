
import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PulsatingMicButton from './PulsatingMicButton';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';
import { useToast } from '@/hooks/use-toast';

// Handle interface for imperative control
export interface VoiceRecorderHandle {
  stopRecording: () => void;
  startRecording: () => void;
}

type VoiceRecorderProps = {
  onVoiceRecorded: (transcript: string) => void;
  isDisabled?: boolean;
};

const VoiceRecorder = forwardRef<VoiceRecorderHandle, VoiceRecorderProps>(
  ({ onVoiceRecorded, isDisabled = false }, ref) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
    const [lastSpeechTime, setLastSpeechTime] = useState<number>(0);
    const [hasSpeechStarted, setHasSpeechStarted] = useState(false);
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

    const startRecording = useCallback(() => {
      if (isDisabled) return;

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        if (recognitionInstance) {
          recognitionInstance.stop();
        }

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
          if (isRecording) {
            recognition.start();
          } else {
            setIsRecording(false);
          }
        };

        recognition.start();
        setRecognitionInstance(recognition);
      } else {
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in your browser",
          variant: "destructive",
        });
      }
    }, [isDisabled, initVoiceDetection, recognitionInstance, toast, isRecording]);

    const stopRecording = useCallback(() => {
      if (recognitionInstance) {
        recognitionInstance.stop();
        setIsRecording(false);
        setHasSpeechStarted(false);
      }
    }, [recognitionInstance]);

    // Expose start/stop methods to parent
    useImperativeHandle(ref, () => ({
      stopRecording,
      startRecording,
    }));

    return (
      <div className="flex-grow flex items-center justify-center py-4">
        <PulsatingMicButton
          isRecording={isRecording}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isDisabled}
        />
      </div>
    );
  }
);

export default VoiceRecorder;
