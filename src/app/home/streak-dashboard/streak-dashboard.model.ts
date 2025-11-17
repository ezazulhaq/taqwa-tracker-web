export interface ReadItem {
    type: 'quran' | 'hadith';
    title: string;
    subtitle?: string;
    link: string;
    timestamp: string;
}

export interface ReadActivity {
    date: string; // Format: YYYY-MM-DD
    itemsRead: number;
    recentItems: ReadItem[];
}

export interface StreakStats {
    currentStreak: number;
    longestStreak: number;
    totalDaysRead: number;
    totalItemsRead: number;
    lastReadDate: string | null;
    readingHistory: ReadActivity[];
}
