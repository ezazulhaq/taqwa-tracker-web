export interface ReadActivity {
    date: string; // Format: YYYY-MM-DD
    itemsRead: number;
}

export interface StreakStats {
    currentStreak: number;
    longestStreak: number;
    totalDaysRead: number;
    totalItemsRead: number;
    lastReadDate: string | null;
    readingHistory: ReadActivity[];
}
