import { Component, signal, inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, catchError } from 'rxjs/operators';
import { QuranService } from '../quran.service';
import { Ayah } from '../quran.model';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnDestroy {

  private readonly quranService = inject(QuranService);
  private readonly router = inject(Router);

  @Output() closeSearchEvent = new EventEmitter<void>();

  searchQuery = signal<string>('');
  searchResults = signal<Ayah[]>([]);
  isSearching = signal<boolean>(false);

  private searchSubscription: Subscription;

  constructor() {
    this.searchSubscription = toObservable(this.searchQuery).pipe(
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

  onSearchInput(value: string) {
    this.searchQuery.set(value);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.isSearching.set(false);
  }

  closeSearch() {
    this.clearSearch();
    this.closeSearchEvent.emit();
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
