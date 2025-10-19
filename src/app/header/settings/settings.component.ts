import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ThemeSelectorService } from '../../service/theme.service';
import { SupabaseService } from '../../service/supabase.service';
import { Translator } from '../../model/translation.model';
import { HeaderService } from '../../header/header.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  // Injected services
  private readonly headerService = inject(HeaderService);
  protected readonly authService = inject(AuthService);
  private readonly themeSelector = inject(ThemeSelectorService);
  private readonly supabaseService = inject(SupabaseService);

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
      this.supabaseService.hadithSource.set(savedSource);
    } else {
      const defaultSource = this.supabaseService.hadithSource();
      localStorage.setItem('hadithSource', defaultSource);
      this.selectedSource.set(defaultSource);
    }
  }

  private loadQuranTranslatorPreference(): void {
    const savedTranslator = localStorage.getItem('quranTranslator');
    if (savedTranslator) {
      this.selectedTranslator.set(savedTranslator);
      this.supabaseService.quranTranslator.set(savedTranslator);
    } else {
      const defaultTranslator = this.supabaseService.quranTranslator();
      localStorage.setItem('quranTranslator', defaultTranslator);
      this.selectedTranslator.set(defaultTranslator);
    }
  }

  private loadQuranTranslators(): void {
    this.supabaseService.getQuranTranslators().subscribe({
      next: (data: { data: Translator[] }) => {
        this.quranTranslators.set(data.data);
      }
    });
  }

  private loadHadithSources(): void {
    this.supabaseService.findActiveHadithSources().subscribe({
      next: (data: { data: { name: string }[] }) => {
        this.hadithSources.set(data.data.map(item => item.name));
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
    this.supabaseService.quranTranslator.set(select.value);
  }

  onHadithSourceChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSource.set(select.value);
    this.supabaseService.hadithSource.set(select.value);
  }
}