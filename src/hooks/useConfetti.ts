import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const triggerConfetti = () => {
    // Trigger confetti with calm, therapeutic colors
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffafcc', '#ff9aa2', '#b5ead7'],
      gravity: 0.8,
      drift: 0.1,
      scalar: 1.2,
    });

    // Add a second burst with different settings
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.7 },
        colors: ['#c7ceea', '#ffd3a5', '#ffd1ff', '#a8e6cf'],
        gravity: 0.6,
        scalar: 0.8,
      });
    }, 200);
  };

  return { triggerConfetti };
};