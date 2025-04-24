
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SessionSummary from '@/components/session/SessionSummary';
import Header from '@/components/Header';

const SessionSummaryPage = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <div className="flex-grow">
        <SessionSummary onClose={handleClose} />
      </div>
    </div>
  );
};

export default SessionSummaryPage;
