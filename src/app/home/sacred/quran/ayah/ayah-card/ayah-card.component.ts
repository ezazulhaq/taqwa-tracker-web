import { Component, computed, inject, input, output } from '@angular/core';
import { Ayah, BookMarkedSurah } from '../../quran.model';
import { AuthService } from '../../../../../service/auth.service';
import { BookmarkService } from '../../../../../service/bookmark.service';
import { QuranService } from '../../quran.service';
import { ToastService } from '../../../../../shared/toast/toast.service';

@Component({
    selector: 'app-ayah-card',
    standalone: true,
    imports: [],
    templateUrl: './ayah-card.component.html',
    styleUrl: './ayah-card.component.css',
    host: {
        class: 'w-full block'
    }
})
export class AyahCardComponent {
    private readonly authService = inject(AuthService);
    private readonly bookmarkService = inject(BookmarkService);
    protected readonly quranService = inject(QuranService);
    private readonly toastService = inject(ToastService);

    ayah = input.required<Ayah>();
    surahNumber = input.required<string>();
    surahName = input.required<string>();
    surahName_ar = input.required<string>();
    isTranslationVisible = input<boolean>(true);
    bookmarkContext = input<'surah' | 'juz'>('surah'); // Default context
    juzId = input<number | undefined>(undefined);
    onReadClick = output<Ayah>();

    isAuthenticated = computed(() => this.authService.isAuthenticated());

    isBookmarked(bookMarkedSurah: BookMarkedSurah): boolean {
        // Pass context if not present (though toggle creates it with context, check might need it if strict)
        // With current service logic: if type is undefined in check object, it matches if item.type matches strictly (if item has type)
        // We should construct check object with current context
        const checkObject: BookMarkedSurah = { ...bookMarkedSurah, type: this.bookmarkContext() };
        return this.bookmarkService.isBookmarkedAyah(checkObject);
    }

    toggleBookmark(bookMarkedSurah: BookMarkedSurah) {
        // Add context type to bookmark
        const bookmarkWithType: BookMarkedSurah = {
            ...bookMarkedSurah,
            type: this.bookmarkContext(),
            juz_id: this.juzId()
        };
        this.bookmarkService.toggleBookmarkAyah(bookmarkWithType);
    }

    async copyAyah(ayah: Ayah) {
        try {
            let textToCopy = '';

            // Add surah and ayah information
            textToCopy += `${this.surahName()} (${this.surahName_ar()}) - Ayah ${ayah.ayah_no}\n\n`;

            // Add Arabic text
            textToCopy += `${ayah.arabic_text}\n\n`;

            // Add translation if visible
            if (this.isTranslationVisible()) {
                textToCopy += `Translation: ${ayah.translation_text}\n\n`;
            }

            // Add source attribution
            textToCopy += `Source: Quran ${this.surahNumber()}:${ayah.ayah_no}`;

            await navigator.clipboard.writeText(textToCopy);

            // Optional: Show a brief success message
            this.showCopySuccessMessage();

        } catch (error) {
            console.error('Failed to copy ayah:', error);

            // Fallback for older browsers
            this.fallbackCopyToClipboard(ayah);
        }
    }

    private showCopySuccessMessage() {
        this.toastService.show('Ayah copied to clipboard!');
    }

    private fallbackCopyToClipboard(ayah: Ayah) {
        const textArea = document.createElement('textarea');

        let textToCopy = '';
        textToCopy += `${this.surahName()} (${this.surahName_ar()}) - Ayah ${ayah.ayah_no}\n\n`;
        textToCopy += `${ayah.arabic_text}\n\n`;

        if (this.isTranslationVisible()) {
            textToCopy += `Translation: ${ayah.translation_text}\n\n`;
        }

        textToCopy += `Source: Quran ${this.surahNumber()}:${ayah.ayah_no}`;

        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showCopySuccessMessage();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textArea);
    }
}
