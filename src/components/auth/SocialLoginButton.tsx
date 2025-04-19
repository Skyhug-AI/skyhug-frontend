
import React from 'react';
import { Button } from '@/components/ui/button';
import { Google } from 'lucide-react';

interface SocialLoginButtonProps {
  provider: 'google';
  onClick: () => void;
  disabled?: boolean;
}

const SocialLoginButton = ({ provider, onClick, disabled }: SocialLoginButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      <Google className="h-4 w-4" />
      Continue with Google
    </Button>
  );
};

export default SocialLoginButton;
