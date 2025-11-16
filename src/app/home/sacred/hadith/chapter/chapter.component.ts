import { AfterViewInit, Component, computed, effect, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SupabaseService } from '../../../../service/supabase.service';
import { ActivatedRoute } from '@angular/router';
import { Hadiths } from '../hadith.model';
import { BookmarkService } from '../../../../service/bookmark.service';
import { AuthService } from '../../../../service/auth.service';
import { ReadStreakService } from '../../../../service/read-streak.service';
import { ReadItem } from '../../../streak-dashboard/streak-dashboard.model';

@Component({
  selector: 'app-chapter',
  imports: [],
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.css',
  host: {
    class: 'app-bg',
  }
})
export class ChapterComponent implements OnInit, AfterViewInit {

  private readonly authService = inject(AuthService);
  private readonly readStreakService = inject(ReadStreakService);

  @ViewChild('stickyTitle') stickyTitle!: ElementRef;
  private originalOffset: number = 0;

  @ViewChild('hadithContainer') hadithContainer!: ElementRef;

  private hadithIdToScrollTo = signal<number | null>(null);
  private readHadithsSet = new Set<string>(); // Track read hadiths in current session

  chapterId!: string;
  hadithNoParam!: number;

  hadiths = signal<Hadiths[]>([]);

  chapterName = signal<string>("");

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly bookmarkService: BookmarkService,
    private readonly route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.chapterId = params['id'];
      this.hadithNoParam = params['hadithNo'];

      if (this.hadithNoParam) {
        this.hadithIdToScrollTo.set(+this.hadithNoParam);
      }
    });
  }

  ngOnInit(): void {
    this.supabaseService.getHadithByChapterId(this.chapterId).subscribe(
      {
        next: (data: any) => {
          this.hadiths.set(data.data);
          this.chapterName.set(data.data[0].chapter_name);
        },
        complete: () => {
          // Track page view for streak (user opened Hadith)
          //if (this.isAuthenticated()) {
          this.trackReading();
          //}

          // Setup reading tracker
          this.setupReadingTracker();
        }
      }
    );
  }

  ngAfterViewInit() {
    this.originalOffset = this.stickyTitle.nativeElement.offsetTop;

    if (this.hadithIdToScrollTo() !== null) {
      setTimeout(() => {
        this.scrollToHadith(this.hadithIdToScrollTo());
      }, 1000);
    }
  }

  /**
 * Setup Intersection Observer to track when hadiths are read
 */
  private setupReadingTracker(): void {
    if (!this.isAuthenticated()) return;

    setTimeout(() => {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7 // 70% of hadith must be visible
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const hadithElement = entry.target as HTMLElement;
            const hadithId = hadithElement.id.replace('hadith-', '');

            // Only track if not already tracked in this session
            if (!this.readHadithsSet.has(hadithId)) {
              this.readHadithsSet.add(hadithId);
              this.trackReading();
            }
          }
        });
      }, options);

      // Observe all hadith elements
      const hadithElements = this.hadithContainer.nativeElement.querySelectorAll('[id^="hadith-"]');
      hadithElements.forEach((element: Element) => observer.observe(element));
    }, 1000);
  }

  /**
   * Track reading in the streak service
   */
  private trackReading(): void {
    const readItem: ReadItem = {
      type: 'hadith',
      title: `${this.splitChapterName().name_en}`,
      subtitle: `${this.splitChapterName().name_ar || 'Hadith Collection'}`,
      link: `/hadith/chapter?id=${this.chapterId}`,
      timestamp: new Date().toISOString()
    };
    this.readStreakService.trackRead(1, readItem);
  }

  splitChapterName = computed(
    () => {
      const parts = this.chapterName().split('-').map(part => part.trim());

      if (parts.length !== 2) {
        return {
          name_en: this.chapterName(),
          name_ar: ''
        };
      }

      return {
        name_en: parts[0],
        name_ar: parts[1]
      };
    });

  @HostListener('window:scroll', ['$event'])
  handleTitleScroll() {
    const element = this.stickyTitle.nativeElement;
    if (window.scrollY >= this.originalOffset + 300) {
      element.classList.remove('app-title');
      element.classList.add('app-title-stick');
    } else {
      element.classList.add('app-title');
      element.classList.remove('app-title-stick');
    }
  }

  isBookmarked(hadithId: string): boolean {
    return this.bookmarkService.isBookmarkedHadith(hadithId);
  }

  toggleBookmark(hadith: Hadiths) {
    this.bookmarkService.toggleBookmarkHadith(hadith);
  }

  async copyHadith(hadith: Hadiths) {
    try {
      let textToCopy = '';

      // Add chapter and hadith information
      textToCopy += `${this.splitChapterName().name_en}`;
      if (this.splitChapterName().name_ar) {
        textToCopy += ` (${this.splitChapterName().name_ar})`;
      }
      textToCopy += ` - Hadith ${hadith.hadith_no}\n\n`;

      // Add hadith text
      textToCopy += `${hadith.text_en}\n\n`;

      // Add source attribution
      textToCopy += `Source: ${this.splitChapterName().name_en} - Hadith ${hadith.hadith_no}`;

      await navigator.clipboard.writeText(textToCopy);

      // Show success message
      this.showCopySuccessMessage();

    } catch (error) {
      console.error('Failed to copy hadith:', error);

      // Fallback for older browsers
      this.fallbackCopyToClipboard(hadith);
    }
  }

  private showCopySuccessMessage() {
    // Create a temporary success message
    const message = document.createElement('div');
    message.textContent = 'Hadith copied to clipboard!';
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

  private fallbackCopyToClipboard(hadith: Hadiths) {
    const textArea = document.createElement('textarea');

    let textToCopy = '';
    textToCopy += `${this.splitChapterName().name_en}`;
    if (this.splitChapterName().name_ar) {
      textToCopy += ` (${this.splitChapterName().name_ar})`;
    }
    textToCopy += ` - Hadith ${hadith.hadith_no}\n\n`;
    textToCopy += `${hadith.text_en}\n\n`;
    textToCopy += `Source: ${this.splitChapterName().name_en} - Hadith ${hadith.hadith_no}`;

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

  private scrollToHadith(hadithId: number | null): void {
    // Find the hadith by id
    const hadithElement = this.hadithContainer.nativeElement.querySelector(
      `#hadith-${hadithId}`
    );
    if (hadithElement) {
      const elementPosition = hadithElement.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementPosition - 200,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Hadith with ID ${hadithId} not found.`);
    }
  }

}
