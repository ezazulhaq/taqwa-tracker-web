import { effect, inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ThemeSelectorService, AppTheme } from './theme.service';
import { QuranService } from '../home/sacred/quran/quran.service';
import { HadithService } from '../home/sacred/hadith/hadith.service';
import { SalahAppService } from './salah-app.service';
import { NotificationService } from './notification.service';
import { UserPreferences } from '../model/auth.model';

@Injectable({
    providedIn: 'root'
})
export class PreferenceSyncService {
    private authService = inject(AuthService);
    private themeSelector = inject(ThemeSelectorService);
    private quranService = inject(QuranService);
    private hadithService = inject(HadithService);
    private prayerService = inject(SalahAppService);
    private notificationService = inject(NotificationService);

    constructor() {
        console.log('PreferenceSyncService: Constructor running');
        // Watch for user changes and apply preferences
        effect(() => {
            const user = this.authService.currentUser();
            console.log('PreferenceSyncService: Effect triggered. Current user:', user?.email);
            if (user) {
                if (user.preferences) {
                    console.log('PreferenceSyncService: Applying preferences from backend:', user.preferences);
                    this.applyPreferences(user.preferences);
                } else {
                    console.warn('PreferenceSyncService: User logged in but no preferences found in profile');
                }
            } else {
                console.log('PreferenceSyncService: No user logged in, skipping sync');
            }
        });
    }

    private applyPreferences(prefs: UserPreferences): void {
        if (!prefs) return;

        // Apply Theme
        if (prefs.theme) {
            if (prefs.theme === AppTheme.DARK) {
                this.themeSelector.setDarkTheme();
            } else if (prefs.theme === AppTheme.LIGHT) {
                this.themeSelector.setLightTheme();
            } else {
                this.themeSelector.setSystemTheme();
            }
        }

        // Apply Quran Translator
        if (prefs.translator) {
            this.quranService.quranTranslator.set(prefs.translator);
        }

        // Apply Hadith Source
        if (prefs.hadith_source) {
            this.hadithService.hadithSource.set(prefs.hadith_source);
        }

        // Apply Hanafi Preference
        if (prefs.hanafi !== undefined) {
            this.prayerService.isHanafi.set(prefs.hanafi);
            localStorage.setItem('hanafiPreference', prefs.hanafi.toString());
        }

        // Apply Notifications Preference
        if (prefs.salah_alerts !== undefined) {
            this.notificationService.userNotificationsEnabled.set(prefs.salah_alerts);
            localStorage.setItem('userNotificationsEnabled', prefs.salah_alerts.toString());
        }

        // Apply Font Size
        if (prefs.font_size) {
            this.quranService.ayahFontSize.set(prefs.font_size);
        }
    }

    /**
     * Initialize the service. This can be called in AppComponent 
     * to ensure the effect is registered.
     */
    init(): void {
        // The constructor already sets up the effect, but calling this
        // ensures the service is instantiated.
        console.log('PreferenceSyncService initialized');
    }
}
