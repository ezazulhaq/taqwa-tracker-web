export interface WordSearchWord {
    arabic: string;
    english: string;
    meaning?: string;
    found?: boolean;
}

export interface WordSearchLevel {
    id: number;
    title: string;
    description: string;
    gridSize: number;
    words: WordSearchWord[];
}

export interface Cell {
    row: number;
    col: number;
    value: string;
    selected: boolean;
    found: boolean;
    isPartOfWord?: boolean; // For highlighting found words
}

export interface WordSearchState {
    currentLevelId: number;
    grid: Cell[][];
    levels: WordSearchLevel[];
    selectionStart: Cell | null;
    currentSelection: Cell[];
    currentWords: WordSearchWord[];
    foundWords: string[]; // Arabic words
    isGameComplete: boolean;
    score: number;
}
