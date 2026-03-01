import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookmarkService } from '../../../../service/bookmark.service';
import { TitleComponent } from '../../../../shared/title/title.component';
import { AuthService } from '../../../../service/auth.service';
import { ReadStreakService } from '../../../../service/read-streak.service';
import { ReadItem } from '../../../streak-dashboard/streak-dashboard.model';
import { Ayah, BookMarkedSurah } from '../quran.model';

export interface SurahGroup {
    surah_no: number;
    surah_name: string;
    surah_name_ar: string;
    ayahs: Ayah[];
}
import { QuranService } from '../quran.service';
import { AyahSkeletonComponent } from '../../../../shared/skeleton/ayah-skeleton/ayah-skeleton.component';
import { AyahCardComponent } from '../ayah/ayah-card/ayah-card.component';


@Component({
    selector: 'app-juz-ayah',
    imports: [
        FormsModule,
        TitleComponent,
        AyahSkeletonComponent,
        AyahCardComponent
    ],
    templateUrl: './juz-ayah.component.html',
    styleUrl: './juz-ayah.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'app-bg',
    }
})
export class JuzAyahComponent implements AfterViewInit, OnDestroy {

    private readonly authService = inject(AuthService);
    private readonly readStreakService = inject(ReadStreakService);
    protected readonly quranService = inject(QuranService);

    @ViewChild('stickyCheckbox') stickyCheckbox!: ElementRef;
    private originalOffset: number = 0;
    private surahObserver: IntersectionObserver | null = null;

    @ViewChild('ayahContainer') ayahContainer!: ElementRef;

    private ayahIdToScrollTo = signal<number | null>(null);
    private readAyahsSet = new Set<number>(); // Track read ayahs in current session
    private lastReadAyahNo = signal<number | null>(null);

    /** The surah currently in the viewport (for sticky sub-header) */
    currentSurah = signal<SurahGroup | null>(null);

    juzNumber = signal<string>('');
    juzName = signal<string>('');
    juzName_en = signal<string>('');
    ayahNoParam = signal<string>('');

    ayahs = signal<Ayah[]>([]);
    isLoading = signal<boolean>(false);

    // Translation is hidden by default for Juz view
    isTranslationVisible = signal<boolean>(false);

    // ── Custom Jump-to-Ayah dropdown state ────────────────────────
    @ViewChild('dropdownRef') dropdownRef!: ElementRef;
    isDropdownOpen = signal<boolean>(false);
    dropdownSearch = signal<string>('');
    selectedAyahLabel = signal<string>('');
    selectedAyahNumber = signal<string>(''); // kept for scroll logic compatibility

    filteredAyahs = computed(() => {
        const q = this.dropdownSearch().toLowerCase().trim();
        if (!q) return this.ayahs();
        return this.ayahs().filter(a =>
            a.surah_name.toLowerCase().includes(q) ||
            String(a.ayah_no).includes(q)
        );
    });

    translator = computed(() => this.quranService.quranTranslator());

    /** Ayahs grouped by surah, preserving Quran order */
    ayahsBySurah = computed<SurahGroup[]>(() => {
        const groups: SurahGroup[] = [];
        const map = new Map<number, SurahGroup>();
        for (const ayah of this.ayahs()) {
            if (!map.has(ayah.surah_no)) {
                const group: SurahGroup = {
                    surah_no: ayah.surah_no,
                    surah_name: ayah.surah_name,
                    surah_name_ar: ayah.surah_name_ar,
                    ayahs: []
                };
                map.set(ayah.surah_no, group);
                groups.push(group);
            }
            map.get(ayah.surah_no)!.ayahs.push(ayah);
        }
        return groups;
    });

    isAuthenticated = computed(() => this.authService.isAuthenticated());

    constructor(
        private readonly bookmarkService: BookmarkService,
        private readonly route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.juzNumber.set(params['juzNumber'] || '');
            this.juzName.set(params['juzName'] || '');
            this.juzName_en.set(params['juzName_en'] || '');
            this.ayahNoParam.set(params['ayahNo'] || '');

            if (this.ayahNoParam()) {
                this.ayahIdToScrollTo.set(+this.ayahNoParam());
            }
        });

        effect(() => {
            if (this.juzNumber()) {
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
        this.setupSurahObserver();
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
                        // Expected ID format: "ayah-{surah_no}-{ayah_no}"
                        const idParts = ayahElement.id.split('-');
                        if (idParts.length >= 3) {
                            const ayahNumber = parseInt(idParts[2]);

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
        let link = `/quran/juz-ayah?juzNumber=${this.juzNumber()}&juzName=${encodeURIComponent(this.juzName())}&juzName_en=${encodeURIComponent(this.juzName_en())}`;
        let title = `Juz ${this.juzNumber()}`;
        let subtitle = this.juzName_en();

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
     * Toggle the custom dropdown open/closed.
     */
    toggleDropdown(): void {
        this.isDropdownOpen.update(v => !v);
        if (this.isDropdownOpen()) {
            this.dropdownSearch.set('');
        }
    }

    /**
     * Handle Escape key to close the dropdown.
     */
    @HostListener('document:keydown.escape')
    closeDropdownOnEscape(): void {
        this.isDropdownOpen.set(false);
    }

    /**
     * Close dropdown when clicking outside it.
     */
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
            this.isDropdownOpen.set(false);
        }
    }

    /**
     * Select an ayah from the custom dropdown and scroll to it.
     */
    selectAyah(ayah: Ayah): void {
        const value = `${ayah.surah_no}:${ayah.ayah_no}`;
        this.selectedAyahNumber.set(value);
        this.selectedAyahLabel.set(`${ayah.surah_name} : ${ayah.ayah_no}`);
        this.isDropdownOpen.set(false);
        this.dropdownSearch.set('');
        this.scrollToAyah(ayah.surah_no, ayah.ayah_no);
    }

    /** @deprecated kept for compat – use selectAyah() instead */
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

        this.quranService.getAyahsByJuz(+this.juzNumber(), this.translator()).subscribe(
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

    /**
     * Set up IntersectionObserver on surah-header elements
     * to track which surah the user is currently reading.
     */
    private setupSurahObserver(): void {
        const groups = this.ayahsBySurah();
        if (groups.length === 0) return;

        // Clean up any previous observer
        this.surahObserver?.disconnect();

        // We'll observe each surah-header; when a header leaves the top
        // of the viewport, the corresponding surah becomes "current".
        // rootMargin: negative top = trigger when header passes above toolbar zone
        const toolbarHeight = this.stickyCheckbox?.nativeElement?.offsetHeight ?? 80;

        // Track which surah headers are above the viewport
        const headersAbove = new Set<number>();

        this.surahObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const el = entry.target as HTMLElement;
                    const surahIndex = parseInt(el.getAttribute('data-surah-index') ?? '-1', 10);
                    if (surahIndex < 0) continue;

                    if (!entry.isIntersecting && entry.boundingClientRect.top < toolbarHeight) {
                        // Header scrolled above toolbar → this surah is current
                        headersAbove.add(surahIndex);
                    } else {
                        headersAbove.delete(surahIndex);
                    }
                }

                if (headersAbove.size > 0) {
                    // The current surah is the one with the highest index that has scrolled past
                    const maxIndex = Math.max(...headersAbove);
                    this.currentSurah.set(groups[maxIndex]);
                } else {
                    this.currentSurah.set(null);
                }
            },
            {
                root: null,
                rootMargin: `-${toolbarHeight}px 0px 0px 0px`,
                threshold: 0
            }
        );

        // Wait for DOM to render, then observe all surah-header elements
        setTimeout(() => {
            const container = this.ayahContainer?.nativeElement;
            if (!container) return;
            const headers: HTMLElement[] = container.querySelectorAll('[data-surah-index]');
            headers.forEach((el: HTMLElement) => this.surahObserver!.observe(el));
        }, 200);
    }

    ngOnDestroy(): void {
        this.surahObserver?.disconnect();
    }

}
