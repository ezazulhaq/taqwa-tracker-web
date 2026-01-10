import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookmarkService } from '../../service/bookmark.service';
import { QuranService } from '../../home/sacred/quran/quran.service';
import { AuthService } from '../../service/auth.service';
import { BookMarkedSurah, Juz, Surah } from '../../home/sacred/quran/quran.model';

@Component({
    selector: 'app-bookmark-list',
    imports: [CommonModule, RouterLink],
    templateUrl: './bookmark-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkListComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly bookmarkService = inject(BookmarkService);
    private readonly quranService = inject(QuranService);

    type = input<'surah' | 'juz'>('surah'); // Input to filter bookmarks

    bookMarkDetails = signal<{ bookmarked: BookMarkedSurah, surah: Surah, juz?: Juz }[]>([]);
    isAuthenticated = computed(() => this.authService.isAuthenticated());

    private surahList = signal<Surah[]>([]);
    private juzList = signal<Juz[]>([]);

    ngOnInit() {
        this.loadData();
    }

    loadData = linkedSignal(() => {
        // Always fetch surahs for mapping surah names
        this.quranService.getAllSurahs().subscribe({
            next: (data: any) => {
                this.surahList.set(data);
                this.checkAndSetBookmarks();
            },
            error: (err: any) => console.error(err)
        });

        // Fetch Juz if needed
        if (this.type() === 'juz') {
            this.quranService.getAllJuz().subscribe({
                next: (data: any) => {
                    this.juzList.set(data);
                    this.checkAndSetBookmarks();
                },
                error: (err: any) => console.error(err)
            });
        }
    });

    private checkAndSetBookmarks() {
        if (this.surahList().length > 0) {
            if (this.type() === 'juz' && this.juzList().length === 0) {
                // Wait for juz list if type is juz
                // However, if the API fails, we might hang. Ideally assume it works or handle error.
                return;
            }
            this.setBookmarkDetails();
        }
    }

    private setBookmarkDetails() {
        const allBookmarks: BookMarkedSurah[] = Array.from(this.bookmarkService.getBookmarkedAyah());
        const contextType = this.type();
        const filteredBookmarks = allBookmarks.filter(b => b.type === contextType);

        const uniqueSurahIds = [...new Set(filteredBookmarks.map(ayah => ayah.surah_id))];
        const bookMarkedSurahs = this.surahList()
            .filter(surah => uniqueSurahIds.includes(surah.surah_id));

        this.bookMarkDetails.set(
            filteredBookmarks.map(bookmark => {
                const surah = bookMarkedSurahs.find(surah => surah.surah_id === bookmark.surah_id);
                if (!surah) return null;

                let juz: Juz | undefined;
                if (contextType === 'juz' && bookmark.juz_id) {
                    juz = this.juzList().find(j => j.juz_id === bookmark.juz_id);
                }

                return {
                    bookmarked: bookmark,
                    surah: surah,
                    juz: juz
                };
            }).filter(item => item !== null) as { bookmarked: BookMarkedSurah, surah: Surah, juz?: Juz }[]
        );
    }

    removeBookmark(bookmark: BookMarkedSurah) {
        this.bookmarkService.removeAyahBookmark(bookmark);
        this.setBookmarkDetails();
    }
}
