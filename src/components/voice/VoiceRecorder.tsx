
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SendHorizonal } from 'lucide-react';
import PulsatingMicButton from './PulsatingMicButton';

type VoiceRecorderProps = {
  onVoiceRecorded: (transcript: string) => void;
  isDisabled?: boolean;
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onVoiceRecorded, isDisabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);

  const startRecording = () => {
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
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript = event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
      setRecognitionInstance(recognition);
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopRecording = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsRecording(false);
    }
  };

  const sendVoice = () => {
    if (transcript.trim()) {
      onVoiceRecorded(transcript);
      setTranscript('');
    }
  };

  return (
    <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-serenity-100">
      <div className="flex flex-col items-center gap-4">
        {transcript && (
          <div className="w-full p-3 bg-white/80 rounded-xl border border-serenity-100 text-left shadow-sm">
            {transcript}
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <PulsatingMicButton
            isRecording={isRecording}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isDisabled}
          />
          
          {transcript && (
            <Button
              type="button"
              size="icon"
              className="rounded-full shadow-md bg-serenity-500 hover:bg-serenity-600 transition-all duration-300 hover:scale-105"
              onClick={sendVoice}
              disabled={isDisabled}
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
