
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SessionSummary from '@/components/session/SessionSummary';

const SessionSummaryPage = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/home');
  };

  return <SessionSummary onClose={handleClose} />;
};

export default SessionSummaryPage;
