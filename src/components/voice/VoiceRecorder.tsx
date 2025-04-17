
import React, { useState } from 'react';
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
        if (transcript.trim()) {
          onVoiceRecorded(transcript);
          setTranscript('');
        }
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

  return (
    <div className="flex-grow flex items-center justify-center py-4">
      <PulsatingMicButton
        isRecording={isRecording}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isDisabled}
      />
    </div>
  );
};

export default VoiceRecorder;
