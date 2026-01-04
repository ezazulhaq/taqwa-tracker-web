import { Component, effect, inject, OnInit, signal, computed } from '@angular/core';
import { ThemeSelectorService } from '../../service/theme.service';
import { HeaderService } from '../../header/header.service';
import { AuthService } from '../../service/auth.service';
import { QuranService } from '../../home/sacred/quran/quran.service';
import { Translator } from '../../home/sacred/quran/quran.model';
import { UserPreferences } from '../../model/auth.model';
import { HadithService } from '../../home/sacred/hadith/hadith.service';
import { HadithSource } from '../../home/sacred/hadith/hadith.model';
import { SalahAppService } from '../../service/salah-app.service';
import { NotificationService } from '../../service/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  // Injected services
  private readonly headerService = inject(HeaderService);
  protected readonly authService = inject(AuthService);
  private readonly themeSelector = inject(ThemeSelectorService);
  protected readonly quranService = inject(QuranService);
  private readonly hadithService = inject(HadithService);
  protected readonly prayerService = inject(SalahAppService);
  protected readonly notificationService = inject(NotificationService);

  // UI state
  protected localMenuVisible = signal(false);

  isThemeDark = computed(() => this.themeSelector.currentTheme() === 'dark');

  // Data state
  quranTranslators = signal<Translator[]>([]);
  selectedTranslator = computed(() => this.quranService.quranTranslator());
  hadithSources = signal<string[]>([]);
  selectedSource = computed(() => this.hadithService.hadithSource());

  constructor() {
    // Track settings menu visibility
    effect(() => {
      this.localMenuVisible.set(this.headerService.isSettingsVisible());
    });

    // Initialize theme has been replaced by computed signal

    // Load saved preferences has been replaced by effects in Services and computed signals here
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadQuranTranslators();
      this.loadHadithSources();
    }
  }

  private loadQuranTranslators(): void {
    this.quranService.getQuranTranslators().subscribe({
      next: (data: Translator[]) => {
        this.quranTranslators.set(data);
      }
    });
  }

  private loadHadithSources(): void {
    this.hadithService.findActiveHadithSources().subscribe({
      next: (data: HadithSource[]) => {
        this.hadithSources.set(data.map(item => item.name));
      }
    });
  }

  switchTheme(): void {
    if (this.isThemeDark()) {
      this.themeSelector.setLightTheme();
    } else {
      this.themeSelector.setDarkTheme();
    }
  }

  onMenuItemClick(): void {
    this.headerService.closeSettings();
    //window.location.reload();
  }

  onQuranTranslatorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.quranService.quranTranslator.set(select.value);
  }

  onHadithSourceChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.hadithService.hadithSource.set(select.value);
  }

  toggleHanafi(): void {
    this.prayerService.toggleHanafi();
  }

  toggleNotifications(): void {
    if (this.notificationService.notificationsEnabled()) {
      this.notificationService.toggleUserNotifications();
    } else {
      this.notificationService.requestPermission();
    }
  }

  increaseFontSize(): void {
    this.quranService.ayahFontSize.update(size => Math.min(size + 2, 64));
  }

  decreaseFontSize(): void {
    this.quranService.ayahFontSize.update(size => Math.max(size - 2, 16));
  }

  // Saving state
  isSaving = signal(false);
  saveMessage = signal('');

  savePreferences(): void {
    if (!this.authService.isAuthenticated()) return;

    this.isSaving.set(true);
    this.saveMessage.set('');

    const preferences: UserPreferences = {
      theme: this.themeSelector.currentTheme(),
      translator: this.selectedTranslator(),
      hadith_source: this.selectedSource(),
      hanafi: this.prayerService.isHanafi(),
      salah_alerts: this.notificationService.userNotificationsEnabled(),
      font_size: this.quranService.ayahFontSize()
    };

    this.authService.savePreferences(preferences).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveMessage.set('Preferences saved successfully!');
        setTimeout(() => this.saveMessage.set(''), 3000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveMessage.set('Error saving preferences.');
        console.error('Save preferences error:', err);
      }
    });
  }
}