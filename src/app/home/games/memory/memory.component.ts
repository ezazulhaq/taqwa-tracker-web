import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../../../shared/title/title.component';
import { NAMES_OF_ALLAH } from './memory.data';
import { MemoryCard, MemoryLevel, MemoryState } from './memory.model';

@Component({
  selector: 'app-memory',
  imports: [CommonModule, TitleComponent],
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "app-bg"
  }
})
export class MemoryComponent {
  // Config
  public readonly levels: MemoryLevel[] = [
    { level: 1, pairs: 4, difficulty: 'Easy', gridCols: 'grid-cols-2 sm:grid-cols-4' },
    { level: 2, pairs: 6, difficulty: 'Medium', gridCols: 'grid-cols-3 sm:grid-cols-4' },
    { level: 3, pairs: 8, difficulty: 'Hard', gridCols: 'grid-cols-4' },
    { level: 4, pairs: 10, difficulty: 'Expert', gridCols: 'grid-cols-4 sm:grid-cols-5' },
    { level: 5, pairs: 12, difficulty: 'Master', gridCols: 'grid-cols-4 sm:grid-cols-6' }
  ];

  // State Signals
  public readonly selectedLevel = signal<number | null>(null);
  public readonly cards = signal<MemoryCard[]>([]);
  public readonly state = signal<MemoryState>({
    level: 0,
    moves: 0,
    matches: 0,
    isFinished: false,
    flippedCards: []
  });

  // Computed Values
  public readonly currentLevelData = computed(() => {
    const levelId = this.selectedLevel();
    return levelId !== null ? this.levels.find(l => l.level === levelId) : null;
  });

  public readonly progress = computed(() => {
    const levelData = this.currentLevelData();
    if (!levelData) return 0;
    return (this.state().matches / levelData.pairs) * 100;
  });

  // Methods
  public selectLevel(levelId: number) {
    const levelData = this.levels.find(l => l.level === levelId);
    if (!levelData) return;

    this.selectedLevel.set(levelId);
    this.initGame(levelData);
  }

  private initGame(levelData: MemoryLevel) {
    const allNames = [...NAMES_OF_ALLAH].sort(() => Math.random() - 0.5);
    const selectedNames = allNames.slice(0, levelData.pairs);

    const cards: MemoryCard[] = [];
    selectedNames.forEach(name => {
      cards.push({
        id: `${name.id}-arabic`,
        nameId: name.id,
        content: name.arabic,
        type: 'arabic',
        isFlipped: true, // All cards visible from start
        isMatched: false
      });
      cards.push({
        id: `${name.id}-english`,
        nameId: name.id,
        content: name.english,
        type: 'english',
        isFlipped: true, // All cards visible from start
        isMatched: false
      });
    });

    this.cards.set(cards.sort(() => Math.random() - 0.5));

    this.state.set({
      level: levelData.level,
      moves: 0,
      matches: 0,
      isFinished: false,
      flippedCards: []
    });
  }

  public handleCardClick(card: MemoryCard) {
    const s = this.state();

    // Ignore if card is already matched or already selected or game finished
    if (card.isMatched || s.flippedCards.find(c => c.id === card.id) || s.isFinished) return;

    // Check if we already have two cards selected (wait for incorrect match to clear)
    if (s.flippedCards.length >= 2) return;

    const newFlipped = [...s.flippedCards, card];
    this.state.update(curr => ({ ...curr, flippedCards: newFlipped }));

    if (newFlipped.length === 2) {
      this.checkMatch(newFlipped);
    }
  }

  private checkMatch(selected: MemoryCard[]) {
    const [card1, card2] = selected;
    const isMatch = card1.nameId === card2.nameId && card1.type !== card2.type;

    this.state.update(curr => ({ ...curr, moves: curr.moves + 1 }));

    if (isMatch) {
      // Handle Match - Animate "collecting/flipping" them
      setTimeout(() => {
        this.updateCardMatch(card1.id, card2.id);
        this.state.update(curr => {
          const newMatches = curr.matches + 1;
          const isFinished = newMatches === this.currentLevelData()?.pairs;
          return {
            ...curr,
            matches: newMatches,
            isFinished,
            flippedCards: []
          };
        });
      }, 500);
    } else {
      // Handle Mismatch - just clear selection after a short delay
      setTimeout(() => {
        this.state.update(curr => ({ ...curr, flippedCards: [] }));
      }, 800);
    }
  }

  private updateCardMatch(id1: string, id2: string) {
    this.cards.update(curr =>
      curr.map(c => (c.id === id1 || c.id === id2) ? { ...c, isMatched: true, isFlipped: false } : c)
    );
  }

  public restart() {
    this.selectedLevel.set(null);
    this.cards.set([]);
  }

  public getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 dark:text-emerald-400';
      case 'Medium': return 'text-amber-600 dark:text-amber-400';
      case 'Hard': return 'text-orange-600 dark:text-orange-400';
      case 'Expert': return 'text-rose-600 dark:text-rose-400';
      case 'Master': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-slate-900 dark:text-white';
    }
  }

  public isCardSelected(cardId: string): boolean {
    return this.state().flippedCards.some(c => c.id === cardId);
  }
}
