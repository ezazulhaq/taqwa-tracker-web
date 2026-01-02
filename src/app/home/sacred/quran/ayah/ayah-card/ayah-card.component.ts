import { Component, computed, inject, input, output } from '@angular/core';
import { Ayah, BookMarkedSurah } from '../../quran.model';
import { AuthService } from '../../../../../service/auth.service';
import { BookmarkService } from '../../../../../service/bookmark.service';

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

    ayah = input.required<Ayah>();
    surahNumber = input.required<string>();
    surahName = input.required<string>();
    surahName_ar = input.required<string>();
    isTranslationVisible = input<boolean>(true);
    onReadClick = output<number>();

    isAuthenticated = computed(() => this.authService.isAuthenticated());

    isBookmarked(bookMarkedSurah: BookMarkedSurah): boolean {
        return this.bookmarkService.isBookmarkedAyah(bookMarkedSurah);
    }

    toggleBookmark(bookMarkedSurah: BookMarkedSurah) {
        this.bookmarkService.toggleBookmarkAyah(bookMarkedSurah);
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
        // Create a temporary success message
        const message = document.createElement('div');
        message.textContent = 'Ayah copied to clipboard!';
        message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300';

        document.body.appendChild(message);

        // Remove the message after 2 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
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
