import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ThemeSelectorService } from '../../service/theme.service';
import { HeaderService } from '../../header/header.service';
import { AuthService } from '../../service/auth.service';
import { QuranService } from '../../home/sacred/quran/quran.service';
import { Translator } from '../../home/sacred/quran/quran.model';
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
  isThemeDark = signal<boolean>(false);

  // Data state
  quranTranslators = signal<Translator[]>([]);
  selectedTranslator = signal<string>('');
  hadithSources = signal<string[]>([]);
  selectedSource = signal<string>('');

  constructor() {
    // Track settings menu visibility
    effect(() => {
      this.localMenuVisible.set(this.headerService.isSettingsVisible());
    });

    // Initialize theme
    this.initializeTheme();

    // Load saved preferences
    this.loadSavedPreferences();
  }

  ngOnInit(): void {
    this.isThemeDark.set(this.themeSelector.currentTheme() === 'dark');

    if (this.authService.isAuthenticated()) {
      this.loadQuranTranslators();
      this.loadHadithSources();
    }
  }

  private initializeTheme(): void {
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme === 'dark' ? this.themeSelector.setDarkTheme() : this.themeSelector.setLightTheme();
    } else {
      this.themeSelector.setSystemTheme();
    }
  }

  private loadSavedPreferences(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.loadHadithSourcePreference();
    this.loadQuranTranslatorPreference();
  }

  private loadHadithSourcePreference(): void {
    const savedSource = localStorage.getItem('hadithSource');
    if (savedSource) {
      this.selectedSource.set(savedSource);
      this.hadithService.hadithSource.set(savedSource);
    } else {
      const defaultSource = this.hadithService.hadithSource();
      localStorage.setItem('hadithSource', defaultSource);
      this.selectedSource.set(defaultSource);
    }
  }

  private loadQuranTranslatorPreference(): void {
    const savedTranslator = localStorage.getItem('quranTranslator');
    if (savedTranslator) {
      this.selectedTranslator.set(savedTranslator);
      this.quranService.quranTranslator.set(savedTranslator);
    } else {
      const defaultTranslator = this.quranService.quranTranslator();
      localStorage.setItem('quranTranslator', defaultTranslator);
      this.selectedTranslator.set(defaultTranslator);
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
    this.isThemeDark.set(!this.isThemeDark());
    if (this.isThemeDark()) {
      this.themeSelector.setDarkTheme();
    } else {
      this.themeSelector.setLightTheme();
    }
  }

  onMenuItemClick(): void {
    this.headerService.closeSettings();
    //window.location.reload();
  }

  onQuranTranslatorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedTranslator.set(select.value);
    this.quranService.quranTranslator.set(select.value);
  }

  onHadithSourceChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSource.set(select.value);
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
}