export interface NameOfAllah {
    id: number;
    arabic: string;
    english: string;
    transliteration: string;
}

export interface MemoryCard {
    id: string; // Unique ID for each card (e.g., '1-arabic' or '1-english')
    nameId: number; // ID of the Name of Allah
    content: string; // Arabic text or English Meaning
    type: 'arabic' | 'english';
    isFlipped: boolean;
    isMatched: boolean;
}

export interface MemoryLevel {
    level: number;
    pairs: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Master';
    gridCols: string; // e.g., 'grid-cols-2' or 'grid-cols-4'
}

export interface MemoryState {
    level: number;
    moves: number;
    matches: number;
    isFinished: boolean;
    flippedCards: MemoryCard[];
}
