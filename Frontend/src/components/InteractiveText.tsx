import React from 'react';

interface InteractiveTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div';
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
}) => {
  const words = text.split(' ');

  return (
    <Component className={className} aria-label={text}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0" aria-hidden="true">
          {Array.from(word).map((char, cIdx) => (
            <span key={cIdx} className="om-ch">
              {char}
            </span>
          ))}
        </span>
      ))}
    </Component>
  );
};
