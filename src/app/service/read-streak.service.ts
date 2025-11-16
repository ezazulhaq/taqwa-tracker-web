import { Injectable, signal } from "@angular/core";
import { ReadActivity, StreakStats } from "../home/streak-dashboard/streak-dashboard.model";

@Injectable({
    providedIn: 'root'
})
export class ReadStreakService {
    private readonly STORAGE_KEY = 'taqwa_tracker_reading_streak';

    // Signals for reactive updates
    streakStats = signal<StreakStats>(this.loadStreakData());

    constructor() {
        this.initializeStreak();
    }

    /**
     * Initialize streak on service creation
     */
    private initializeStreak(): void {
        const stats = this.loadStreakData();
        this.updateCurrentStreak(stats);
        this.streakStats.set(stats);
    }

    /**
     * Load streak data from localStorage
     */
    private loadStreakData(): StreakStats {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading streak data:', error);
        }

        // Return default stats if no data exists
        return {
            currentStreak: 0,
            longestStreak: 0,
            totalDaysRead: 0,
            totalItemsRead: 0,
            lastReadDate: null,
            readingHistory: []
        };
    }

    /**
     * Save streak data to localStorage
     */
    private saveStreakData(stats: StreakStats): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
            this.streakStats.set(stats);
        } catch (error) {
            console.error('Error saving streak data:', error);
        }
    }

    /**
     * Get today's date in YYYY-MM-DD format
     */
    private getTodayDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    /**
     * Calculate difference in days between two dates
     */
    private getDaysDifference(date1: string, date2: string): number {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Update current streak based on last read date
     */
    private updateCurrentStreak(stats: StreakStats): void {
        if (!stats.lastReadDate) {
            stats.currentStreak = 0;
            return;
        }

        const today = this.getTodayDate();
        const daysSinceLastRead = this.getDaysDifference(stats.lastReadDate, today);

        // If more than 1 day has passed, reset streak
        if (daysSinceLastRead > 1) {
            stats.currentStreak = 0;
        }
    }

    /**
     * Track reading (Ayah or Hadith)
     */
    trackRead(count: number = 1): void {
        const stats = this.loadStreakData();
        const today = this.getTodayDate();

        // Update or create today's activity
        const todayActivity = this.getTodaysActivity(stats, today);
        todayActivity.itemsRead += count;

        // Update totals
        stats.totalItemsRead += count;

        // Update streak if it's a new day
        if (stats.lastReadDate !== today) {
            this.incrementStreak(stats, today);
        }

        this.saveStreakData(stats);
    }

    /**
     * Get or create today's activity
     */
    private getTodaysActivity(stats: StreakStats, today: string): ReadActivity {
        let todayActivity = stats.readingHistory.find(a => a.date === today);

        if (!todayActivity) {
            todayActivity = {
                date: today,
                itemsRead: 0
            };
            stats.readingHistory.push(todayActivity);

            // Keep only last 90 days of history
            if (stats.readingHistory.length > 90) {
                stats.readingHistory = stats.readingHistory.slice(-90);
            }
        }

        return todayActivity;
    }

    /**
     * Increment streak counter
     */
    private incrementStreak(stats: StreakStats, today: string): void {
        const lastReadDate = stats.lastReadDate;

        if (!lastReadDate) {
            // First time reading
            stats.currentStreak = 1;
            stats.totalDaysRead = 1;
        } else {
            const daysDiff = this.getDaysDifference(lastReadDate, today);

            if (daysDiff === 1) {
                // Consecutive day
                stats.currentStreak += 1;
                stats.totalDaysRead += 1;
            } else if (daysDiff > 1) {
                // Streak broken, restart
                stats.currentStreak = 1;
                stats.totalDaysRead += 1;
            }
            // If daysDiff === 0, same day, don't increment
        }

        // Update longest streak
        if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
        }

        stats.lastReadDate = today;
    }

    /**
     * Get reading activity for last N days
     */
    getRecentActivity(days: number = 7): ReadActivity[] {
        const stats = this.loadStreakData();
        return stats.readingHistory.slice(-days);
    }

    /**
     * Reset all streak data (for testing or user request)
     */
    resetStreak(): void {
        const defaultStats: StreakStats = {
            currentStreak: 0,
            longestStreak: 0,
            totalDaysRead: 0,
            totalItemsRead: 0,
            lastReadDate: null,
            readingHistory: []
        };
        this.saveStreakData(defaultStats);
    }

    /**
     * Get current streak stats
     */
    getStreakStats(): StreakStats {
        return this.streakStats();
    }
}