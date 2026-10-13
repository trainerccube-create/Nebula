import React, { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  isWarping?: boolean;
  isRedAlert?: boolean;
}

export const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  isWarping = false,
  isRedAlert = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const starCount = 140;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (isRedAlert) {
        bgGrad.addColorStop(0, '#0a0305');
        bgGrad.addColorStop(0.5, '#140508');
        bgGrad.addColorStop(1, '#050102');
      } else {
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(0.5, '#030712');
        bgGrad.addColorStop(1, '#000000');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const currentSpeed = isWarping ? s.speed * 12 : s.speed;

        s.x -= currentSpeed;
        if (s.x < 0) {
          s.x = width;
          s.y = Math.random() * height;
        }

        ctx.fillStyle = isRedAlert
          ? `rgba(255, 90, 110, ${s.alpha})`
          : `rgba(165, 243, 252, ${s.alpha})`;

        if (isWarping) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + currentSpeed * 4, s.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${s.alpha * 0.8})`;
          ctx.lineWidth = s.size;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isWarping, isRedAlert]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
