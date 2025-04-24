
export const getScaleStyle = (baseScale: number, volumeLevel: number) => {
  const volumeBoost = volumeLevel * 0.2;
  const maxScale = baseScale + 0.1;
  const calculatedScale = baseScale + volumeBoost;
  return `${Math.min(calculatedScale, maxScale)}`;
};
