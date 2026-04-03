
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HadithChapters, HadithDetail } from './hadith.model';
import { ListHomeComponent } from '../../../shared/skeleton/list-home/list-home.component';
import { BookmarkService } from '../../../service/bookmark.service';
import { TitleComponent } from '../../../shared/title/title.component';
import { AuthService } from '../../../service/auth.service';
import { HadithService } from './hadith.service';

@Component({
  selector: 'app-hadith',
  imports: [
    RouterLink,
    ListHomeComponent,
    TitleComponent
],
  templateUrl: './hadith.component.html',
  styleUrl: './hadith.component.css',
  host: {
    class: 'app-bg'
  }
})
export class HadithComponent {

  private readonly authService = inject(AuthService);
  private readonly hadithService = inject(HadithService);

  chapterList = signal<HadithChapters[]>([]);

  hadithSource = computed(() => this.hadithService.hadithSource());

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  bookMarkDetails = signal<HadithDetail[]>([]);

  constructor(
    private readonly router: Router,
    private readonly bookMarkService: BookmarkService
  ) {
    effect(() => {
      console.log(`Hadith Source Home: ${this.hadithSource()}`);
      this.getChaptersFromSource();
      this.getBookmarkedHadiths();
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
