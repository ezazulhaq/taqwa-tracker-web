export interface Choice {
    text: string;
    nextSceneId: string;
    wisdomAdded?: number;
    feedback?: string;
}

export interface Scene {
    id: string;
    title: string;
    text: string;
    choices: Choice[];
    themeColor?: string; // e.g., 'primary', 'amber', 'rose'
    imageHint?: string; // Optional icon or emoji
}

export interface Journey {
    id: string;
    prophetName: string;
    title: string;
    description: string;
    icon: string;
    themeColor: string;
    scenes: Scene[];
}

export interface JourneyState {
    currentJourneyId: string | null;
    currentSceneId: string;
    wisdomPoints: number;
    hasVisited: string[];
    isFinished: boolean;
}
