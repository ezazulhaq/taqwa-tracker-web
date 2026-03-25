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
import { AyahCardComponent } from '../ayah/ayah-card/ayah-card.component';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-surah-ayah',
    imports: [
        FormsModule,
        TitleComponent,
        AyahSkeletonComponent,
        AyahCardComponent
    ],
    templateUrl: './surah-ayah.component.html',
    styleUrl: './surah-ayah.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'app-bg',
    }
})
export class SurahAyahComponent {

    private readonly authService = inject(AuthService);
    private readonly readStreakService = inject(ReadStreakService);
    protected readonly quranService = inject(QuranService);

    @ViewChild('stickyCheckbox') stickyCheckbox!: ElementRef;
    private originalOffset: number = 0;

    @ViewChild('ayahContainer') ayahContainer!: ElementRef;

    private ayahIdToScrollTo = signal<number | null>(null);
    private readAyahsSet = new Set<string>(); // Track read ayahs in current session
    private lastReadAyahNo = signal<number | null>(null);

    surahNumber = signal<string>('');
    surahName = signal<string>('');
    surahName_ar = signal<string>('');
    ayahNoParam = signal<string>('');

    ayahs = signal<Ayah[]>([]);
    isLoading = signal<boolean>(false);

    isTranslationVisible = signal<boolean>(true);

    // ── Custom Jump-to-Ayah dropdown state ────────────────────────
    @ViewChild('dropdownRef') dropdownRef!: ElementRef;
    isDropdownOpen = signal<boolean>(false);
    dropdownSearch = signal<string>('');
    selectedAyahLabel = signal<string>('');
    selectedAyahNumber = signal<string>(''); // kept for scroll logic compatibility

    filteredAyahs = computed(() => {
        const q = this.dropdownSearch().toLowerCase().trim();
        if (!q) return this.ayahs();
        return this.ayahs().filter(a => String(a.ayah_no).includes(q));
    });

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

            if (this.ayahNoParam()) {
                this.ayahIdToScrollTo.set(+this.ayahNoParam());
            }
        });

        effect(() => {
            if (this.surahNumber()) {
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
                    this.selectedAyahLabel.set(`Ayah ${targetAyah.ayah_no}`);
                }
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
                        // Expected ID format: "ayah-{surah_no}-{ayah_no}"
                        const idParts = ayahElement.id.split('-');
                        if (idParts.length >= 3) {
                            const surahNumber = parseInt(idParts[1]);
                            const ayahNumber = parseInt(idParts[2]);
                            const compositeId = `${surahNumber}-${ayahNumber}`;

                            if (!this.readAyahsSet.has(compositeId)) {
                                this.readAyahsSet.add(compositeId);
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
        let link = `/quran/surah-ayah?surahNumber=${this.surahNumber()}&surahName=${encodeURIComponent(this.surahName())}&surahName_ar=${encodeURIComponent(this.surahName_ar())}`;
        let title = `${this.surahName()}`;
        let subtitle = `Surah ${this.surahNumber()}`;

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

    @HostListener('document:keydown.escape')
    closeDropdownOnEscape(): void {
        this.isDropdownOpen.set(false);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
            this.isDropdownOpen.set(false);
        }
    }

    selectAyah(ayah: Ayah): void {
        const value = `${ayah.surah_no}:${ayah.ayah_no}`;
        this.selectedAyahNumber.set(value);
        this.selectedAyahLabel.set(`Ayah ${ayah.ayah_no}`);
        this.isDropdownOpen.set(false);
        this.dropdownSearch.set('');
        this.scrollToAyah(ayah.surah_no, ayah.ayah_no);
    }

    /** @deprecated kept for compat */
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

        this.quranService.getAllAyahs(+this.surahNumber(), this.translator()).subscribe(
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
