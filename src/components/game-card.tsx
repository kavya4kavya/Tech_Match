"use client";

import { Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  content: string;
  isFlipped: boolean;
  onClick: () => void;
}

export function GameCard({ content, isFlipped, onClick }: GameCardProps) {
  const handleInteraction = () => {
    if (!isFlipped) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInteraction();
    }
  };

  return (
    <div
      className={cn('aspect-square rounded-lg card-container', { flipped: isFlipped })}
      onClick={handleInteraction}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isFlipped ? -1 : 0}
      aria-label="Game card"
    >
      <div
        className={cn('relative w-full h-full card-inner', {
          'cursor-pointer': !isFlipped,
          'cursor-default': isFlipped,
        })}
      >
        <div className="absolute w-full h-full card-front bg-secondary flex items-center justify-center p-4 border-2 border-primary/50 transition-colors hover:border-primary">
          <Cpu className="w-1/2 h-1/2 text-primary/70" />
        </div>
        <div className="absolute w-full h-full card-back bg-card flex items-center justify-center p-2 text-center border-2 border-accent">
          <p className="font-code text-xs sm:text-sm md:text-base text-accent-foreground">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
