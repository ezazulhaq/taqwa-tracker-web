import { Component, signal, inject, OnDestroy, Output, EventEmitter, computed } from '@angular/core';
import { HadithDetail } from '../hadith.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, catchError } from 'rxjs/operators';
import { HadithService } from '../hadith.service';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnDestroy {

  private readonly hadithService = inject(HadithService);
  private readonly router = inject(Router);

  hadithSource = computed(() => this.hadithService.hadithSource());

  @Output() closeSearchEvent = new EventEmitter<void>();

  searchQuery = signal<string>('');
  searchResults = signal<HadithDetail[]>([]);
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
        return this.hadithService.searchHadith(query, 10, this.hadithSource()).pipe(
          catchError(() => of([] as HadithDetail[])),
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

  goToHadith(hadith: HadithDetail) {
    this.closeSearch();
    this.router.navigate(['/hadith/chapter'], {
      queryParams: {
        id: hadith.chapter_id,
        hadithNo: hadith.hadith_no
      }
    });
  }
}
