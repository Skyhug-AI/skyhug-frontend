
import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-muted-foreground">
            Your personal AI therapist in the cloud, available 24/7 to listen and help you find clarity.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="text-muted-foreground hover:text-skyhug-500 transition-colors">Home</a></li>
            <li><a href="/chat" className="text-muted-foreground hover:text-skyhug-500 transition-colors">Chat Therapy</a></li>
            <li><a href="/voice" className="text-muted-foreground hover:text-skyhug-500 transition-colors">Voice Therapy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-skyhug-500 transition-colors">About</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-muted-foreground hover:text-skyhug-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-skyhug-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-skyhug-500 transition-colors">Disclaimer</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-border text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} Skyhug AI. All rights reserved.</p>
        <p className="mt-1">Skyhug is not a replacement for professional mental health services.</p>
      </div>
    </footer>
  );
};

export default Footer;
