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
  protected readonly quranService = inject(QuranService);

  @ViewChild('stickyCheckbox') stickyCheckbox!: ElementRef;
  private originalOffset: number = 0;

  @ViewChild('ayahContainer') ayahContainer!: ElementRef;

  private ayahIdToScrollTo = signal<number | null>(null);
  private readAyahsSet = new Set<number>(); // Track read ayahs in current session
  private lastReadAyahNo = signal<number | null>(null);

  surahNumber = signal<string>('');
  surahName = signal<string>('');
  surahName_ar = signal<string>('');
  ayahNoParam = signal<string>('');

  juzNumber = signal<string>('');
  juzName = signal<string>('');
  juzName_en = signal<string>('');

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
      this.surahNumber.set(params['surahNumber'] || '');
      this.surahName.set(params['surahName'] || '');
      this.surahName_ar.set(params['surahName_ar'] || '');
      this.ayahNoParam.set(params['ayahNo'] || '');

      this.juzNumber.set(params['juzNumber'] || '');
      this.juzName.set(params['juzName'] || '');
      this.juzName_en.set(params['juzName_en'] || '');

      if (this.ayahNoParam()) {
        this.ayahIdToScrollTo.set(+this.ayahNoParam());
      }
    });

    effect(() => {
      // If viewing by Juz, hide translation by default
      if (this.juzNumber()) {
        this.isTranslationVisible.set(false);
      }
      // Trigger data fetch when params change (and are non-empty if required)
      // We use untracked or just rely on signal dependencies if robust.
      // But here simpler to just call it.
      if (this.surahNumber() || this.juzNumber()) {
        this.getTranslatedAayahs();
      }
    });
  }

  ngAfterViewInit() {
    this.originalOffset = this.stickyCheckbox.nativeElement.offsetTop;
    this.trackReading();
  }

  private handleScrollAfterDataLoad() {
    if (this.ayahIdToScrollTo() !== null && this.ayahs().length > 0) {
      setTimeout(() => {
        const targetAyahNo = this.ayahIdToScrollTo();
        const targetAyah = this.ayahs().find(a => a.ayah_no === targetAyahNo);

        if (targetAyah) {
          this.scrollToAyah(targetAyah.surah_no, targetAyah.ayah_no);
          this.selectedAyahNumber.set(`${targetAyah.surah_no}:${targetAyah.ayah_no}`);
        }
      }, 100);
    }
    this.setupReadingTracker();
  }

  /**
   * Setup Intersection Observer to track when ayahs are read
   */
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
            // Expected ID format: "ayah-{surah_no}-{ayah_no}"
            const idParts = ayahElement.id.split('-');
            if (idParts.length >= 3) {
              const ayahNumber = parseInt(idParts[2]);
              // We might want to track surah number too if needed eventually
              // const surahNumber = parseInt(idParts[1]);

              if (!this.readAyahsSet.has(ayahNumber)) {
                this.readAyahsSet.add(ayahNumber);
                this.lastReadAyahNo.set(ayahNumber);
                this.trackReading();
              }
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
    let link = '';
    let title = '';
    let subtitle = '';

    if (this.juzNumber()) {
      link = `/quran/ayah?juzNumber=${this.juzNumber()}&juzName=${encodeURIComponent(this.juzName())}&juzName_en=${encodeURIComponent(this.juzName_en())}`;
      title = this.juzName_en();
      subtitle = `Juz ${this.juzNumber()}`;
    } else {
      link = `/quran/ayah?surahNumber=${this.surahNumber()}&surahName=${encodeURIComponent(this.surahName())}&surahName_ar=${encodeURIComponent(this.surahName_ar())}`;
      title = `${this.surahName()}`;
      subtitle = `Surah ${this.surahNumber()}`;
    }

    if (this.lastReadAyahNo()) {
      link += `&ayahNo=${this.lastReadAyahNo()}`;
    }

    const readItem: ReadItem = {
      type: 'quran',
      title: title,
      subtitle: subtitle,
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
   * Expects format: "surah_no:ayah_no"
   */
  onAyahSelect(value: string): void {
    if (value && value !== '') {
      const [surahNo, ayahNo] = value.split(':').map(Number);
      this.scrollToAyah(surahNo, ayahNo);
    }
  }

  /**
   * Navigate to reading mode and scroll to specific ayah
   */
  navigateToReading(ayah: Ayah): void {
    this.isTranslationVisible.set(false);
    this.lastReadAyahNo.set(ayah.ayah_no);
    setTimeout(() => {
      this.scrollToAyah(ayah.surah_no, ayah.ayah_no);
    }, 100);
  }

  /**
   * Navigate to translation mode and scroll to specific ayah
   */
  navigateToTranslation(ayah: Ayah): void {
    this.isTranslationVisible.set(true);
    setTimeout(() => {
      this.scrollToAyah(ayah.surah_no, ayah.ayah_no);
    }, 100);
  }

  toggleBookmark(bookMarkedSurah: BookMarkedSurah) {
    this.bookmarkService.toggleBookmarkAyah(bookMarkedSurah);
  }

  /**
   * Scroll to specific ayah by surah and ayah number
   * Uses composite ID: ayah-{surah_no}-{ayah_no}
   */
  private scrollToAyah(surahNo: number, ayahNo: number | null): void {
    if (!ayahNo) return;

    // Construct ID using composite key
    const elementId = `ayah-${surahNo}-${ayahNo}`;

    // Find the Ayah element
    const ayahElement = this.ayahContainer.nativeElement.querySelector(`#${elementId}`);

    if (ayahElement) {
      const elementPosition = ayahElement.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementPosition - 200,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Ayah with ID ${elementId} not found.`);
    }
  }

  private getTranslatedAayahs() {
    this.isLoading.set(true);

    let apiCall;
    if (this.juzNumber()) {
      apiCall = this.quranService.getAyahsByJuz(+this.juzNumber(), this.translator());
    } else {
      apiCall = this.quranService.getAllAyahs(+this.surahNumber(), this.translator());
    }

    apiCall.subscribe(
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
