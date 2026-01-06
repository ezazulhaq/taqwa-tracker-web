import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../../../shared/title/title.component';
import { Question, QuizLevel, QuizState } from './quiz.model';
import { QUIZ_DATA } from './quiz.data';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, TitleComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "app-bg"
  }
})
export class QuizComponent {
  // State Signals
  public readonly levels = signal<QuizLevel[]>(QUIZ_DATA);
  public readonly selectedLevel = signal<number | null>(null);
  public readonly sessionQuestions = signal<Question[]>([]);

  public readonly state = signal<QuizState>({
    level: 0,
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false,
    selectedOption: null,
    showExplanation: false
  });

  // Computed Values
  public readonly currentLevelData = computed(() => {
    const levelId = this.selectedLevel();
    return levelId !== null ? this.levels().find(l => l.level === levelId) : null;
  });

  public readonly currentQuestion = computed(() => {
    const questions = this.sessionQuestions();
    const index = this.state().currentQuestionIndex;
    return questions.length > 0 ? questions[index] : null;
  });

  public readonly progress = computed(() => {
    const questions = this.sessionQuestions();
    if (questions.length === 0) return 0;
    return ((this.state().currentQuestionIndex + 1) / questions.length) * 100;
  });

  // Methods
  public selectLevel(level: number) {
    const levelData = this.levels().find(l => l.level === level);
    if (!levelData) return;

    // Shuffle and pick 10 questions
    const shuffled = [...levelData.questions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);

    this.sessionQuestions.set(selected);
    this.selectedLevel.set(level);
    this.state.set({
      level,
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false,
      selectedOption: null,
      showExplanation: false
    });
  }

  public handleOptionSelection(optionIndex: number) {
    if (this.state().selectedOption !== null) return;

    const question = this.currentQuestion();
    if (!question) return;

    const isCorrect = optionIndex === question.correctAnswer;

    this.state.update(s => ({
      ...s,
      selectedOption: optionIndex,
      showExplanation: true,
      score: isCorrect ? s.score + 1 : s.score
    }));
  }

  public nextQuestion() {
    const questions = this.sessionQuestions();
    const isLast = this.state().currentQuestionIndex === questions.length - 1;

    if (isLast) {
      this.state.update(s => ({ ...s, isFinished: true }));
    } else {
      this.state.update(s => ({
        ...s,
        currentQuestionIndex: s.currentQuestionIndex + 1,
        selectedOption: null,
        showExplanation: false
      }));
    }
  }

  public restart() {
    this.selectedLevel.set(null);
    this.sessionQuestions.set([]);
    this.state.set({
      level: 0,
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false,
      selectedOption: null,
      showExplanation: false
    });
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

  public getOptionClass(index: number): string {
    const s = this.state();
    const q = this.currentQuestion();

    if (s.selectedOption === null) {
      return 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border-slate-200 dark:border-white/20 text-slate-700 dark:text-white';
    }

    if (index === q?.correctAnswer) {
      return 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-400';
    }

    if (index === s.selectedOption && index !== q?.correctAnswer) {
      return 'bg-rose-50 dark:bg-rose-500/20 border-rose-500/50 text-rose-700 dark:text-rose-400';
    }

    return 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 dark:text-white/40 cursor-not-allowed';
  }
}
