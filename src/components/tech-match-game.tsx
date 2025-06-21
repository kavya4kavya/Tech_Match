"use client";

import { useState, useEffect, useCallback } from 'react';
import type { GenerateTechContentOutput } from '@/ai/flows/generate-tech-content';
import { GameCard } from './game-card';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from '@/hooks/use-toast';

type CardData = {
  id: string;
  pairId: number;
  content: string;
};

type TechMatchGameProps = {
  initialPairs: GenerateTechContentOutput['pairs'];
};

export function TechMatchGame({ initialPairs }: TechMatchGameProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const initializeAndShuffleCards = useCallback(() => {
    const gameCards: CardData[] = [];
    initialPairs.forEach((pair, index) => {
      gameCards.push({ id: `q-${index}`, pairId: index, content: pair.question });
      gameCards.push({ id: `a-${index}`, pairId: index, content: pair.answer });
    });

    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setAttempts(0);
    setIsChecking(false);
  }, [initialPairs]);

  useEffect(() => {
    initializeAndShuffleCards();
  }, [initializeAndShuffleCards]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      setAttempts((prev) => prev + 1);
      const [firstIndex, secondIndex] = flippedIndices;
      const card1 = cards[firstIndex];
      const card2 = cards[secondIndex];

      if (card1.pairId === card2.pairId) {
        setMatchedPairIds((prev) => [...prev, card1.pairId]);
        setFlippedIndices([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (initialPairs.length > 0 && matchedPairIds.length === initialPairs.length) {
      toast({
        title: 'Congratulations!',
        description: `You've matched all pairs in ${attempts} attempts!`,
        duration: 5000,
      });
    }
  }, [matchedPairIds, attempts, initialPairs, toast]);

  const handleCardClick = (index: number) => {
    if (isChecking || flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairIds.includes(cards[index].pairId)) {
      return;
    }
    setFlippedIndices((prev) => [...prev, index]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">
          Tech Match
        </h1>
        <p className="text-muted-foreground mt-2">
          A memory game with a tech twist.
        </p>
      </div>

      <Card className="w-full max-w-lg bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4 flex justify-between items-center">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground tracking-wider">ATTEMPTS</p>
            <p className="text-3xl font-bold font-headline text-accent">{attempts}</p>
          </div>
          <Button onClick={initializeAndShuffleCards} size="lg" className="font-headline text-lg">
            New Game
          </Button>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground tracking-wider">MATCHES</p>
            <p className="text-3xl font-bold font-headline text-accent">
              {matchedPairIds.length} / {initialPairs.length}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-2 md:gap-4 w-full">
        {cards.map((card, index) => (
          <GameCard
            key={card.id}
            content={card.content}
            isFlipped={flippedIndices.includes(index) || matchedPairIds.includes(card.pairId)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
