import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListHomeComponent } from '../../../../shared/skeleton/list-home/list-home.component';
import { AuthService } from '../../../../service/auth.service';
import { QuranService } from '../quran.service';
import { Surah } from '../quran.model';
import { SortButtonComponent } from '../../../../shared/sort-button/sort-button.component';
import { BookmarkListComponent } from '../../../../shared/bookmark-list/bookmark-list.component';

@Component({
    selector: 'app-surah-list',
    imports: [
        CommonModule,
        RouterLink,
        ListHomeComponent,
        SortButtonComponent,
        BookmarkListComponent
    ],
    templateUrl: './surah-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurahListComponent implements OnInit {

    private readonly authService = inject(AuthService);
    private readonly quranService = inject(QuranService);

    surahList = signal<Surah[]>([]);
    isAscending = signal<boolean>(true);
    isAuthenticated = computed(() => this.authService.isAuthenticated());

    ngOnInit(): void {
        this.getSurahList();
    }

    getSurahList = linkedSignal(() => {
        this.quranService.getAllSurahs()
            .subscribe(
                {
                    next: (data: any) => {
                        this.surahList.set(data);
                    },
                    error: (error: any) => console.log(error.error),
                    complete: () => {
                        console.log("surahs loaded")
                    }
                }
            );
    });

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
}
