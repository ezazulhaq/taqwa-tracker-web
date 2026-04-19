
import { Component, computed, effect, inject, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HadithChapters, HadithDetail } from './hadith.model';
import { ListHomeComponent } from '../../../shared/skeleton/list-home/list-home.component';
import { BookmarkService } from '../../../service/bookmark.service';
import { TitleComponent } from '../../../shared/title/title.component';
import { AuthService } from '../../../service/auth.service';
import { HadithService } from './hadith.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, catchError, of } from 'rxjs';

@Component({
  selector: 'app-hadith',
  imports: [
    RouterLink,
    FormsModule,
    ListHomeComponent,
    TitleComponent
  ],
  templateUrl: './hadith.component.html',
  styleUrl: './hadith.component.css',
  host: {
    class: 'app-bg'
  }
})
export class HadithComponent implements OnDestroy {

  private readonly authService = inject(AuthService);
  private readonly hadithService = inject(HadithService);

  chapterList = signal<HadithChapters[]>([]);

  hadithSource = computed(() => this.hadithService.hadithSource());

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  bookMarkDetails = signal<HadithDetail[]>([]);

  isSearchOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  searchResults = signal<HadithDetail[]>([]);
  isSearching = signal<boolean>(false);

  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly bookMarkService: BookmarkService
  ) {
    this.searchSubscription = this.searchSubject.pipe(
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

    effect(() => {
      console.log(`Hadith Source Home: ${this.hadithSource()}`);
      this.getChaptersFromSource();
      this.getBookmarkedHadiths();
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
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

  goToHadith(hadith: HadithDetail) {
    this.closeSearch();
    this.router.navigate(['/hadith/chapter'], {
      queryParams: {
        id: hadith.chapter_id,
        hadithNo: hadith.hadith_no
      }
    });
  }

  ngOnInit(): void {
    // Initial data loading is handled by the effect
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }

  private getChaptersFromSource() {
    console.log("getChaptersFromSource function called");
    this.hadithService.getHadithChaptersFromSource(this.hadithSource())
      .subscribe(
        {
          next: (data: HadithChapters[]) => {
            this.chapterList.set(data);
          },
          error: (error: any) => console.log(error.error),
          complete: () => console.log("hadith chapters loaded")
        }
      );
  };

  private getBookmarkedHadiths() {
    console.log("getBookmarkedHadiths function called");
    const hadith_ids: string[] = this.bookMarkService.getBookmarkedHadiths();

    this.hadithService.getHadithDetailsByIds(hadith_ids)
      .subscribe(
        {
          next: (data: HadithDetail[]) => {
            const hadithDetails = data
              .filter((hadith: HadithDetail) => hadith.source_name === this.hadithSource())
              .sort((a: any, b: any) => {
                return b.hadith_no - a.hadith_no;
              });
            this.bookMarkDetails.set(hadithDetails);
          },
          error: (error: any) => console.log(error.error),
          complete: () => console.log("complete hadith details")
        });
  };

  removeBookmark(bookmark: HadithDetail) {
    this.bookMarkService.removeHadithBookmark(bookmark);
    this.getBookmarkedHadiths();
  }
}
