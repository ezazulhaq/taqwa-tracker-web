import { Injectable, signal, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

// Enum which contains only LIGHT and DARK themes, if DEVICE theme selected it means you don't need a value for this purpose. DEVICE theme means no user preferences in the app. That is why value should be undefined (removed from localStorage).
export enum AppTheme {
    LIGHT = 'light',
    DARK = 'dark',
}
// for SSR and SSG support.
const CLIENT_RENDER = typeof localStorage !== 'undefined';
// name of variable in localStorage.
const LS_THEME = 'theme';
// previously selected value by user, if available.
let selectedTheme: AppTheme | undefined = undefined;
// if render happens on client side
if (CLIENT_RENDER) {
    // then set value from localStorage or if it not available leave it undefined.
    selectedTheme = localStorage.getItem(LS_THEME) as AppTheme || undefined;
}

@Injectable({
    providedIn: 'root'
})
export class ThemeSelectorService {
    private meta = inject(Meta);
    currentTheme = signal<AppTheme | undefined>(selectedTheme);

    initTheme() {
        if (this.currentTheme()) {
            // Theme is already set (from localStorage), apply it
            this.applyTheme(this.currentTheme()!);
        } else {
            // No theme set, default to system
            this.setSystemTheme();
        }
    }

    setLightTheme() {
        this.currentTheme.set(AppTheme.LIGHT);
        this.setToLocalStorage(AppTheme.LIGHT);
        this.applyTheme(AppTheme.LIGHT);
    }
    setDarkTheme() {
        this.currentTheme.set(AppTheme.DARK);
        this.setToLocalStorage(AppTheme.DARK);
        this.applyTheme(AppTheme.DARK);
    }
    setSystemTheme() {
        this.removeFromLocalStorage();
        const theme = isSystemDark() ? AppTheme.DARK : AppTheme.LIGHT;
        this.currentTheme.set(theme);
        this.applyTheme(theme);
    }
    private applyTheme(theme: AppTheme) {
        if (CLIENT_RENDER) {
            if (theme === AppTheme.DARK) {
                document.documentElement.classList.add('dark');
                this.meta.updateTag({ name: 'theme-color', content: '#1e293b' });
            } else {
                document.documentElement.classList.remove('dark');
                this.meta.updateTag({ name: 'theme-color', content: '#ffffff' });
            }
        }
    }
    private setToLocalStorage(theme: AppTheme) {
        if (CLIENT_RENDER) {
            localStorage.setItem(LS_THEME, theme);
        }
    }
    private removeFromLocalStorage() {
        if (CLIENT_RENDER) {
            localStorage.removeItem(LS_THEME);
        }
    }
}

function isSystemDark() {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
        return false;
    }
}