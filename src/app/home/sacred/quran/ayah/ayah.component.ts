import { Component, computed, effect, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookmarkService } from '../../../../service/bookmark.service';
import { TitleComponent } from '../../../../shared/title/title.component';
import { AuthService } from '../../../../service/auth.service';
import { ReadStreakService } from '../../../../service/read-streak.service';
import { ReadItem } from '../../../streak-dashboard/streak-dashboard.model';
import { Ayah, BookMarkedSurah } from '../quran.model';
import { QuranService } from '../quran.service';
import { AyahSkeletonComponent } from '../../../../shared/skeleton/ayah-skeleton/ayah-skeleton.component';
import { AyahCardComponent } from './ayah-card/ayah-card.component';

@Component({
  selector: 'app-ayah',
  imports: [
    FormsModule,
    TitleComponent,
    AyahSkeletonComponent,
    AyahCardComponent
  ],
  templateUrl: './ayah.component.html',
  styleUrl: './ayah.component.css',
  host: {
    class: 'app-bg',
  }
})
export class AyahComponent {

  private readonly authService = inject(AuthService);
  private readonly readStreakService = inject(ReadStreakService);
  private readonly quranService = inject(QuranService);

  @ViewChild('stickyCheckbox') stickyCheckbox!: ElementRef;
  private originalOffset: number = 0;

  @ViewChild('ayahContainer') ayahContainer!: ElementRef;

  private ayahIdToScrollTo = signal<number | null>(null);
  private readAyahsSet = new Set<number>(); // Track read ayahs in current session
  private lastReadAyahNo = signal<number | null>(null);

  surahNumber!: string;
  surahName!: string;
  surahName_ar!: string;
  ayahNoParam!: string;

  ayahs = signal<Ayah[]>([]);
  isLoading = signal<boolean>(false);

  isTranslationVisible = signal<boolean>(true);
  selectedAyahNumber = signal<string>(''); // For dropdown selection

  translator = computed(() => this.quranService.quranTranslator());

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(
    private readonly bookmarkService: BookmarkService,
    private readonly route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.surahNumber = params['surahNumber'];
      this.surahName = params['surahName'];
      this.surahName_ar = params['surahName_ar'];
      this.ayahNoParam = params['ayahNo'];

      if (this.ayahNoParam) {
        this.ayahIdToScrollTo.set(+this.ayahNoParam);
      }
    });

    effect(() => {
      this.getTranslatedAayahs();
    });
  }

  ngAfterViewInit() {
    this.originalOffset = this.stickyCheckbox.nativeElement.offsetTop;
    this.trackReading();
  }

  private handleScrollAfterDataLoad() {
    if (this.ayahIdToScrollTo() !== null && this.ayahs().length > 0) {
      setTimeout(() => {
        this.scrollToAyah(this.ayahIdToScrollTo());
        this.selectedAyahNumber.set(this.ayahIdToScrollTo()?.toString() || '');
      }, 100);
    }
    this.setupReadingTracker();
  }

  /**
   * Setup Intersection Observer to track when ayahs are read
   */
  private setupReadingTracker(): void {
    if (!this.isAuthenticated() || this.ayahs().length === 0) return;

    const delay = this.ayahIdToScrollTo() !== null ? 500 : 100;

    setTimeout(() => {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.8
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const ayahElement = entry.target as HTMLElement;
            const ayahId = ayahElement.id.replace('ayah-', '');
            const ayahNumber = parseInt(ayahId);

            if (!this.readAyahsSet.has(ayahNumber)) {
              this.readAyahsSet.add(ayahNumber);
              this.lastReadAyahNo.set(ayahNumber);
              this.trackReading();
            }
          }
        });
      }, options);

      const ayahElements = this.ayahContainer.nativeElement.querySelectorAll('[id^="ayah-"]');
      ayahElements.forEach((element: Element) => observer.observe(element));
    }, delay);
  }

  /**
   * Track reading in the streak service
   */
  private trackReading(): void {
    let link = `/quran/ayah?surahNumber=${this.surahNumber}&surahName=${encodeURIComponent(this.surahName)}&surahName_ar=${encodeURIComponent(this.surahName_ar)}`;
    if (this.lastReadAyahNo()) {
      link += `&ayahNo=${this.lastReadAyahNo()}`;
    }

    const readItem: ReadItem = {
      type: 'quran',
      title: `${this.surahName}`,
      subtitle: `Surah ${this.surahNumber}`,
      link: link,
      timestamp: new Date().toISOString()
    };
    this.readStreakService.trackRead(1, readItem);
  }

  @HostListener('window:scroll')
  handleCheckBoxScroll() {
    const element = this.stickyCheckbox.nativeElement;
    if (window.scrollY >= this.originalOffset) {
      element.classList.add('checkbox-fixed');
    } else {
      element.classList.remove('checkbox-fixed');
    }
  }

  /**
   * Handle ayah selection from dropdown
   */
  onAyahSelect(ayahNumber: string): void {
    if (ayahNumber && ayahNumber !== '') {
      this.scrollToAyah(+ayahNumber);
    }
  }

  /**
   * Navigate to reading mode and scroll to specific ayah
   */
  navigateToReading(ayahNumber: number): void {
    this.isTranslationVisible.set(false);
    this.lastReadAyahNo.set(ayahNumber);
    setTimeout(() => {
      this.scrollToAyah(ayahNumber);
    }, 100);
  }

  /**
   * Navigate to translation mode and scroll to specific ayah
   */
  navigateToTranslation(ayahNumber: number): void {
    this.isTranslationVisible.set(true);
    setTimeout(() => {
      this.scrollToAyah(ayahNumber);
    }, 100);
  }

  toggleBookmark(bookMarkedSurah: BookMarkedSurah) {
    this.bookmarkService.toggleBookmarkAyah(bookMarkedSurah);
  }



  /**
   * Scroll to specific ayah by number
   * Renamed from scrollToHadith to scrollToAyah for clarity
   */
  private scrollToAyah(ayahNo: number | null): void {
    if (!ayahNo) return;

    // Find the Ayah by number
    const ayahElement = this.ayahContainer.nativeElement.querySelector(
      `#ayah-${ayahNo}`
    );

    if (ayahElement) {
      const elementPosition = ayahElement.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementPosition - 200,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Ayah with Number ${ayahNo} not found.`);
    }
  }

  private getTranslatedAayahs() {
    console.log("getTranslatedAayahs function called");
    this.isLoading.set(true);
    this.quranService.getAllAyahs(+this.surahNumber, this.translator()).subscribe(
      {
        next: (data: any) => {
          this.ayahs.set(data);
          this.handleScrollAfterDataLoad();
          this.isLoading.set(false);
        },
        error: (error: any) => {
          console.log(error.error);
          this.isLoading.set(false);
        },
        complete: () => console.log(`Aayahs set this translator: ${this.translator()}`)
      }
    );
  }

}
