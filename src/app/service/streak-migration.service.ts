import { Injectable } from '@angular/core';

/**
 * Service to migrate old reading streak data to new route format
 * Converts old /quran/ayah links to new /quran/surah-ayah or /quran/juz-ayah
 */
@Injectable({
    providedIn: 'root'
})
export class StreakMigrationService {
    private readonly STORAGE_KEY = 'taqwa_tracker_reading_streak';
    private readonly MIGRATION_KEY = 'taqwa_tracker_streak_migrated_v3.1.0';

    constructor() {
        this.migrateIfNeeded();
    }

    /**
     * Check if migration is needed and perform it
     */
    private migrateIfNeeded(): void {
        // Check if already migrated
        const isMigrated = localStorage.getItem(this.MIGRATION_KEY);
        if (isMigrated === 'true') {
            return;
        }

        console.log('[StreakMigration] Starting migration to v3.1.0 routes...');

        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) {
                // No data to migrate, mark as migrated
                localStorage.setItem(this.MIGRATION_KEY, 'true');
                return;
            }

            const streakData = JSON.parse(data);
            let migratedCount = 0;

            // Migrate reading history
            if (streakData.readingHistory && Array.isArray(streakData.readingHistory)) {
                streakData.readingHistory.forEach((activity: any) => {
                    if (activity.recentItems && Array.isArray(activity.recentItems)) {
                        activity.recentItems.forEach((item: any) => {
                            if (item.link && item.link.includes('/quran/ayah?')) {
                                // Migrate the link
                                const migratedLink = this.migrateLink(item.link);
                                if (migratedLink !== item.link) {
                                    item.link = migratedLink;
                                    migratedCount++;
                                }
                            }
                        });
                    }
                });
            }

            // Save migrated data
            if (migratedCount > 0) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(streakData));
                console.log(`[StreakMigration] Successfully migrated ${migratedCount} links`);
            } else {
                console.log('[StreakMigration] No links needed migration');
            }

            // Mark migration as complete
            localStorage.setItem(this.MIGRATION_KEY, 'true');
        } catch (error) {
            console.error('[StreakMigration] Error during migration:', error);
            // Don't mark as migrated if there was an error
        }
    }

    /**
     * Migrate a single link from old format to new format
     */
    private migrateLink(oldLink: string): string {
        // Check if this is a Juz or Surah link
        if (oldLink.includes('juzNumber=')) {
            // Juz link: /quran/ayah?juzNumber=... => /quran/juz-ayah?juzNumber=...
            return oldLink.replace('/quran/ayah?', '/quran/juz-ayah?');
        } else if (oldLink.includes('surahNumber=')) {
            // Surah link: /quran/ayah?surahNumber=... => /quran/surah-ayah?surahNumber=...
            return oldLink.replace('/quran/ayah?', '/quran/surah-ayah?');
        }

        // If we can't determine, leave as is (redirect will handle it)
        return oldLink;
    }

    /**
     * Force re-migration (for testing)
     */
    forceMigration(): void {
        localStorage.removeItem(this.MIGRATION_KEY);
        this.migrateIfNeeded();
    }
}
