import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../../../shared/title/title.component';
import { Scene, JourneyState, Choice, Journey } from './journey.model';
import { PROPHET_JOURNEYS } from './journey.data';

@Component({
  selector: 'app-journey',
  imports: [CommonModule, TitleComponent],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "app-bg"
  }
})
export class JourneyComponent {
  // Config
  public readonly journeys = signal<Journey[]>(PROPHET_JOURNEYS);

  // State Signals
  public readonly gameState = signal<JourneyState>({
    currentJourneyId: null,
    currentSceneId: 'start',
    wisdomPoints: 0,
    hasVisited: ['start'],
    isFinished: false
  });

  public readonly feedbackMessage = signal<string | null>(null);

  // Computed Values
  public readonly currentJourney = computed(() => {
    const id = this.gameState().currentJourneyId;
    return this.journeys().find(j => j.id === id) || null;
  });

  public readonly currentScene = computed(() => {
    const journey = this.currentJourney();
    if (!journey) return null;
    const sceneId = this.gameState().currentSceneId;
    return journey.scenes.find(s => s.id === sceneId) || null;
  });

  public readonly isLastScene = computed(() => {
    const scene = this.currentScene();
    return scene ? scene.choices.length === 0 : false;
  });

  // Methods
  public selectJourney(journeyId: string) {
    this.feedbackMessage.set(null);
    this.gameState.set({
      currentJourneyId: journeyId,
      currentSceneId: 'start',
      wisdomPoints: 0,
      hasVisited: ['start'],
      isFinished: false
    });
  }

  public makeChoice(choice: Choice) {
    if (this.gameState().isFinished) return;

    if (choice.feedback) {
      this.feedbackMessage.set(choice.feedback);
    } else {
      this.feedbackMessage.set(null);
    }

    this.gameState.update(s => ({
      ...s,
      currentSceneId: choice.nextSceneId,
      wisdomPoints: s.wisdomPoints + (choice.wisdomAdded || 0),
      hasVisited: [...s.hasVisited, choice.nextSceneId],
      isFinished: choice.nextSceneId === 'finish'
    }));
  }

  public dismissFeedback() {
    this.feedbackMessage.set(null);
  }

  public restart() {
    this.feedbackMessage.set(null);
    this.gameState.update(s => ({
      ...s,
      currentJourneyId: null,
      isFinished: false
    }));
  }

  public getThemeClass(theme?: string): string {
    switch (theme) {
      case 'primary': return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20';
      case 'amber': return 'bg-amber-50 dark:bg-amber-500/10 border-amber-500/20';
      case 'rose': return 'bg-rose-50 dark:bg-rose-500/10 border-rose-500/20';
      case 'emerald': return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20';
      case 'slate': return 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10';
      case 'orange': return 'bg-orange-50 dark:bg-orange-500/10 border-orange-500/20';
      case 'red': return 'bg-red-50 dark:bg-red-500/10 border-red-500/20';
      case 'indigo': return 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/20';
      case 'pink': return 'bg-pink-50 dark:bg-pink-500/10 border-pink-500/20';
      default: return 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10';
    }
  }

  public getButtonClass(theme?: string): string {
    switch (theme) {
      case 'primary': return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'amber': return 'bg-amber-600 hover:bg-amber-700 text-white';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700 text-white';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'orange': return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'red': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'indigo': return 'bg-indigo-600 hover:bg-indigo-700 text-white';
      default: return 'bg-primary hover:bg-primary-dark text-white';
    }
  }

  public getTextTheme(theme?: string): string {
    switch (theme) {
      case 'primary': return 'text-emerald-700 dark:text-emerald-400';
      case 'amber': return 'text-amber-700 dark:text-amber-400';
      case 'rose': return 'text-rose-700 dark:text-rose-400';
      case 'emerald': return 'text-emerald-700 dark:text-emerald-400';
      case 'orange': return 'text-orange-700 dark:text-orange-400';
      case 'red': return 'text-red-700 dark:text-red-400';
      case 'indigo': return 'text-indigo-700 dark:text-indigo-400';
      default: return 'text-primary';
    }
  }
}
