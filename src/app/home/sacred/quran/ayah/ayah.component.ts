import { Component, computed, effect, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { SupabaseService } from '../../../../service/supabase.service';
import { ActivatedRoute } from '@angular/router';
import { Translation } from '../../../../model/translation.model';
import { FormsModule } from '@angular/forms';
import { BookmarkService } from '../../../../service/bookmark.service';
import { BookMarkedSurah } from '../../../../model/surah.model';
import { TitleComponent } from '../../../../shared/title/title.component';
import { AuthService } from '../../../../service/auth.service';
import { ReadStreakService } from '../../../../service/read-streak.service';

@Component({
  selector: 'app-ayah',
  imports: [
    FormsModule,
    TitleComponent
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

  @ViewChild('stickyCheckbox') stickyCheckbox!: ElementRef;
  private originalOffset: number = 0;

  @ViewChild('ayahContainer') ayahContainer!: ElementRef;

  private ayahIdToScrollTo = signal<number | null>(null);
  private readAyahsSet = new Set<number>(); // Track read ayahs in current session

  surahNumber!: string;
  surahName!: string;
  surahName_ar!: string;
  ayahNoParam!: string;

  ayahs = signal<Translation[]>([]);

  isTranslationVisible = signal<boolean>(true);
  selectedAyahNumber = signal<string>(''); // For dropdown selection

  translator = computed(() => this.supabaseService.quranTranslator());

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(
    private readonly supabaseService: SupabaseService,
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

  ngOnInit(): void {
    // Track page view for streak (user opened Quran)
    //if (this.isAuthenticated()) {
    this.trackReading();
    //}

    // Setup Intersection Observer for tracking visible ayahs
    this.setupReadingTracker();
  }

  ngAfterViewInit() {
    this.originalOffset = this.stickyCheckbox.nativeElement.offsetTop;

    if (this.ayahIdToScrollTo() !== null) {
      setTimeout(() => {
        this.scrollToAyah(this.ayahIdToScrollTo());
        // Set the dropdown to the scrolled ayah
        this.selectedAyahNumber.set(this.ayahIdToScrollTo()?.toString() || '');
      }, 1000);
    }
  }

  /**
 * Setup Intersection Observer to track when ayahs are read
 */
  private setupReadingTracker(): void {
    if (!this.isAuthenticated()) return;

    // Wait for ayahs to be loaded
    setTimeout(() => {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.8 // 80% of ayah must be visible
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const ayahElement = entry.target as HTMLElement;
            const ayahId = ayahElement.id.replace('ayah-', '');
            const ayahNumber = parseInt(ayahId);

            // Only track if not already tracked in this session
            if (!this.readAyahsSet.has(ayahNumber)) {
              this.readAyahsSet.add(ayahNumber);
              this.trackReading();
            }
          }
        });
      }, options);

      // Observe all ayah elements
      const ayahElements = this.ayahContainer.nativeElement.querySelectorAll('[id^="ayah-"]');
      ayahElements.forEach((element: Element) => observer.observe(element));
    }, 1000);
  }

  /**
   * Track reading in the streak service
   */
  private trackReading(): void {
    this.readStreakService.trackRead();
  }

  @HostListener('window:scroll', ['$event'])
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

  isBookmarked(bookMarkedSurah: BookMarkedSurah): boolean {
    return this.bookmarkService.isBookmarkedAyah(bookMarkedSurah);
  }

  toggleBookmark(bookMarkedSurah: BookMarkedSurah) {
    this.bookmarkService.toggleBookmarkAyah(bookMarkedSurah);
  }

  async copyAyah(ayah: Translation) {
    try {
      let textToCopy = '';

      // Add surah and ayah information
      textToCopy += `${this.surahName} (${this.surahName_ar}) - Ayah ${ayah.ayah_number}\n\n`;

      // Add Arabic text
      textToCopy += `${ayah.arabic_text_original}\n\n`;

      // Add translation if visible
      if (this.isTranslationVisible()) {
        textToCopy += `Translation: ${ayah.translation}\n\n`;
      }

      // Add source attribution
      textToCopy += `Source: Quran ${this.surahNumber}:${ayah.ayah_number}`;

      await navigator.clipboard.writeText(textToCopy);

      // Optional: Show a brief success message
      this.showCopySuccessMessage();

    } catch (error) {
      console.error('Failed to copy ayah:', error);

      // Fallback for older browsers
      this.fallbackCopyToClipboard(ayah);
    }
  }

  private showCopySuccessMessage() {
    // Create a temporary success message
    const message = document.createElement('div');
    message.textContent = 'Ayah copied to clipboard!';
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300';

    document.body.appendChild(message);

    // Remove the message after 2 seconds
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 2000);
  }

  private fallbackCopyToClipboard(ayah: Translation) {
    const textArea = document.createElement('textarea');

    let textToCopy = '';
    textToCopy += `${this.surahName} (${this.surahName_ar}) - Ayah ${ayah.ayah_number}\n\n`;
    textToCopy += `${ayah.arabic_text_original}\n\n`;

    if (this.isTranslationVisible()) {
      textToCopy += `Translation: ${ayah.translation}\n\n`;
    }

    textToCopy += `Source: Quran ${this.surahNumber}:${ayah.ayah_number}`;

    textArea.value = textToCopy;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.showCopySuccessMessage();
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
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
    this.supabaseService.getSurahTranslation("en", +this.surahNumber, this.translator()).subscribe(
      {
        next: (data: any) => {
          this.ayahs.set(data.data);
        },
        error: (error: any) => console.log(error.error),
        complete: () => console.log(`Aayahs set this translator: ${this.translator()}`)
      }
    );
  }

}
