import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../../service/supabase.service';
import { Router, RouterLink } from '@angular/router';
import { BookMarkedSurah, Surah } from '../../../model/surah.model';
import { ListHomeComponent } from '../../../shared/skeleton/list-home/list-home.component';
import { BookmarkService } from '../../../service/bookmark.service';
import { TitleComponent } from '../../../shared/title/title.component';
import { AuthService } from '../../../service/auth.service';

@Component({
    selector: 'app-quran',
    imports: [
        CommonModule,
        RouterLink,
        ListHomeComponent,
        TitleComponent
    ],
    templateUrl: './quran.component.html',
    styleUrl: './quran.component.css',
    host: {
        class: 'app-bg'
    }
})
export class QuranComponent implements OnInit {

    private readonly authService = inject(AuthService);

    surahList = signal<Surah[]>([]);

    isAscending = signal<boolean>(true);

    bookMarkDetails = signal<{ bookmarked: BookMarkedSurah, surah: Surah }[]>([]);

    isAuthenticated = computed(() => this.authService.isAuthenticated());

    constructor(
        private readonly router: Router,
        private readonly supabaseService: SupabaseService,
        private readonly bookmarkService: BookmarkService
    ) { }

    ngOnInit(): void {
        this.getSurahList();
    }

    redirectToHome() {
        this.router.navigate(['/home']);
    }

    getSurahList = computed(() => {
        this.supabaseService.getSurahList()
            .subscribe(
                {
                    next: (data: any) => {
                        this.surahList.set(data.data);
                    },
                    error: (error: any) => console.log(error.error),
                    complete: () => {
                        console.log("surahs loaded")
                        this.setBookmarkDetails();
                    }
                }
            );
    });

    private setBookmarkDetails() {
        const bookmarkedAyahs: BookMarkedSurah[] = Array.from(this.bookmarkService.getBookmarkedAyah());

        // Get unique surah_ids from bookmarkedAyahs
        const uniqueSurahIds = [...new Set(bookmarkedAyahs.map(ayah => ayah.surah_id))];

        // Filter surahs that match bookmarked ayahs
        const bookMarkedSurahs = this.surahList()
            .filter(surah =>
                uniqueSurahIds.includes(surah.surah_id)
            );

        this.bookMarkDetails.set(
            bookmarkedAyahs.map(bookmark => {
                const surah = bookMarkedSurahs.find(surah => surah.surah_id === bookmark.surah_id);
                return {
                    bookmarked: bookmark,
                    surah: surah!
                };
            })
        );
        console.log(this.bookMarkDetails());
    }

    toggleSort() {
        this.isAscending.set(!this.isAscending());
        this.surahList.set(
            this.surahList().sort(
                (a, b) => {
                    const comparison = a.surah_id - b.surah_id;
                    return this.isAscending() ? comparison : -comparison;
                }
            )
        );
    }

    removeBookmark(bookmark: BookMarkedSurah) {
        this.bookmarkService.removeAyahBookmark(bookmark);
        this.setBookmarkDetails();
    }
}
