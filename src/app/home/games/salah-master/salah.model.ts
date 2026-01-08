export type SalahPosture =
    | 'standing'
    | 'bowing'
    | 'prostrating'
    | 'sitting'
    | 'wudu-step'
    | 'intent';

export interface SalahStep {
    id: string;
    posture: SalahPosture;
    name: string;
    arabic?: string;
    transliteration?: string;
    translation?: string;
    imageHint?: string;
    audioHint?: string;
    instruction?: string;
}

export interface Prayer {
    id: string;
    name: string;
    type: 'fard' | 'sunnah' | 'wudu';
    rakats?: number;
    description: string;
    icon: string;
    themeColor: string;
    steps: SalahStep[];
}

export interface SalahState {
    currentPrayerId: string | null;
    currentMode: 'learning' | 'challenge';
    currentStepIndex: number;
    score: number;
    isFinished: boolean;
    shuffledSteps?: SalahStep[]; // For challenge mode
}
