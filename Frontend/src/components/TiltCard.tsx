import React, { useRef } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 7,
  className = '',
  onClick,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const goalRef = useRef({ x: 0, y: 0 });
  const nowRef = useRef({ x: 0, y: 0 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    goalRef.current.x = px * 2 - 1;
    goalRef.current.y = py * 2 - 1;

    cardRef.current.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);

    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(step);
    }
  };

  const step = () => {
    if (!cardRef.current) return;
    nowRef.current.x += (goalRef.current.x - nowRef.current.x) * 0.12;
    nowRef.current.y += (goalRef.current.y - nowRef.current.y) * 0.12;

    const rx = (-nowRef.current.y * maxTilt).toFixed(2);
    const ry = (nowRef.current.x * maxTilt).toFixed(2);

    cardRef.current.style.setProperty('--rx', `${rx}deg`);
    cardRef.current.style.setProperty('--ry', `${ry}deg`);

    const diff =
      Math.abs(goalRef.current.x - nowRef.current.x) +
      Math.abs(goalRef.current.y - nowRef.current.y);

    if (diff < 0.001) {
      animFrameRef.current = null;
      return;
    }

    animFrameRef.current = requestAnimationFrame(step);
  };

  const onPointerLeave = () => {
    goalRef.current.x = 0;
    goalRef.current.y = 0;
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(step);
    }
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
