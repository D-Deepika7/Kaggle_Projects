import React, { useEffect } from 'react';

interface CustomCursorProps {
  enabled: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ enabled }) => {
  useEffect(() => {
    // Toggle cursor class on body based on enabled state
    if (enabled) {
      document.body.classList.add('custom-cursor');
    } else {
      document.body.classList.remove('custom-cursor');
    }

    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Create particle occasionally to improve performance and avoid jank
      // Check prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      if (Math.random() > 0.8) {
        const particle = document.createElement('div');
        particle.classList.add('leaf-particle');
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 650);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  return null;
};

export default CustomCursor;
