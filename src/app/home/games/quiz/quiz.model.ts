export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number; // Index of options array
    explanation?: string;
}

export interface QuizLevel {
    level: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Master';
    questions: Question[];
}

export interface QuizState {
    level: number;
    currentQuestionIndex: number;
    score: number;
    isFinished: boolean;
    selectedOption: number | null;
    showExplanation: boolean;
}
