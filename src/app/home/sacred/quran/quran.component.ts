import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '../../../shared/title/title.component';
import { AuthService } from '../../../service/auth.service';
import { QuranService } from './quran.service';
import { Ayah } from './quran.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, catchError, of } from 'rxjs';

@Component({
    selector: 'app-quran',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        TitleComponent
    ],
    templateUrl: './quran.component.html',
    styleUrl: './quran.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'app-bg'
    }
})
export class QuranComponent implements OnDestroy {

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly quranService = inject(QuranService);

    isSearchOpen = signal<boolean>(false);
    searchQuery = signal<string>('');
    searchResults = signal<Ayah[]>([]);
    isSearching = signal<boolean>(false);

    private searchSubject = new Subject<string>();
    private searchSubscription: Subscription;

    constructor() {
        this.searchSubscription = this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.isSearching.set(true)),
            switchMap(query => {
                if (!query.trim()) {
                    this.isSearching.set(false);
                    return of([]);
                }
                return this.quranService.searchQuran(query).pipe(
                    catchError(() => of([] as Ayah[])),
                    finalize(() => this.isSearching.set(false))
                );
            })
        ).subscribe(results => {
            this.searchResults.set(results);
            this.isSearching.set(false);
        });
    }

    ngOnDestroy() {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }

    redirectToHome() {
        this.router.navigate(['/home']);
    }

    openSearch() {
        this.isSearchOpen.set(true);
    }

    closeSearch() {
        this.isSearchOpen.set(false);
        this.clearSearch();
    }

    clearSearch() {
        this.searchQuery.set('');
        this.searchResults.set([]);
        this.isSearching.set(false);
    }

    onSearchInput(value: string) {
        this.searchQuery.set(value);
        this.searchSubject.next(value);
    }

    goToAyah(ayah: Ayah) {
        this.closeSearch();
        this.router.navigate(['/quran/surah-ayah'], {
            queryParams: {
                surahNumber: ayah.surah_no,
                surahName: ayah.surah_name,
                surahName_ar: ayah.surah_name_ar,
                ayahNo: ayah.ayah_no
            }
        });
    }
}
