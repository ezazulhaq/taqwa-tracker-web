import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../../../shared/title/title.component';
import { Prayer, SalahStep, SalahState } from './salah.model';
import { PRAYERS } from './salah.data';

@Component({
  selector: 'app-salah-master',
  imports: [CommonModule, TitleComponent],
  templateUrl: './salah-master.component.html',
  styleUrl: './salah-master.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "app-bg"
  }
})
export class SalahMasterComponent {
  // Config
  public readonly prayers = signal<Prayer[]>(PRAYERS);

  // State
  public readonly state = signal<SalahState>({
    currentPrayerId: null,
    currentMode: 'learning',
    currentStepIndex: 0,
    score: 0,
    isFinished: false
  });

  // Computed
  public readonly currentPrayer = computed(() => {
    const id = this.state().currentPrayerId;
    return this.prayers().find(p => p.id === id) || null;
  });

  public readonly currentStep = computed(() => {
    const prayer = this.currentPrayer();
    if (!prayer) return null;

    const steps = this.state().currentMode === 'learning'
      ? prayer.steps
      : this.state().shuffledSteps || [];

    return steps[this.state().currentStepIndex] || null;
  });

  public readonly progress = computed(() => {
    const prayer = this.currentPrayer();
    if (!prayer) return 0;
    return Math.round(((this.state().currentStepIndex) / prayer.steps.length) * 100);
  });

  // Methods
  public selectPrayer(prayerId: string) {
    this.state.update(s => ({
      ...s,
      currentPrayerId: prayerId,
      currentStepIndex: 0,
      isFinished: false,
      score: 0
    }));
  }

  public setMode(mode: 'learning' | 'challenge') {
    const prayer = this.currentPrayer();
    let shuffled: SalahStep[] = [];

    if (mode === 'challenge' && prayer) {
      shuffled = [...prayer.steps].sort(() => Math.random() - 0.5);
    }

    this.state.update(s => ({
      ...s,
      currentMode: mode,
      currentStepIndex: 0,
      isFinished: false,
      shuffledSteps: shuffled
    }));
  }

  public nextStep() {
    const prayer = this.currentPrayer();
    if (!prayer) return;

    if (this.state().currentStepIndex < prayer.steps.length - 1) {
      this.state.update(s => ({
        ...s,
        currentStepIndex: s.currentStepIndex + 1
      }));
    } else {
      this.state.update(s => ({
        ...s,
        isFinished: true
      }));
    }
  }

  public prevStep() {
    if (this.state().currentStepIndex > 0) {
      this.state.update(s => ({
        ...s,
        currentStepIndex: s.currentStepIndex - 1
      }));
    }
  }

  public reset() {
    this.state.set({
      currentPrayerId: null,
      currentMode: 'learning',
      currentStepIndex: 0,
      score: 0,
      isFinished: false
    });
  }

  public getThemeClass(theme?: string): string {
    switch (theme) {
      case 'indigo': return 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/20';
      case 'cyan': return 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-500/20';
      case 'orange': return 'bg-orange-50 dark:bg-orange-500/10 border-orange-500/20';
      case 'emerald': return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20';
      default: return 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10';
    }
  }

  public getTextTheme(theme?: string): string {
    switch (theme) {
      case 'indigo': return 'text-indigo-600 dark:text-indigo-400';
      case 'cyan': return 'text-cyan-600 dark:text-cyan-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      case 'emerald': return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-primary';
    }
  }
}
