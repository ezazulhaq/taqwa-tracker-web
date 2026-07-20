import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, computed, effect, input, output, signal } from '@angular/core';
import { PDFProgressData, PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';
import { IslamicLibrary } from '../../model/islamic-library.model';

@Component({
  selector: 'app-pdf-viewer',
  imports: [
    CommonModule,
    PdfViewerModule,
    FormsModule,
  ],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent implements OnInit {

  pdfSrc = input.required<string>();
  storageKey = input.required<string>();
  initialPage = input<number>();

  pageChange = output<number>();

  page = signal<number>(1);
  pagesRendered = signal<number>(0);
  totalPages = signal<number>(0);
  isLoaded = signal<boolean>(false);
  zoom = signal<number>(1);
  progressData!: PDFProgressData;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
    effect(() => {
      this.updateIslamicLibrary();
    });
    effect(() => {
      this.pageChange.emit(this.page());
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const overridePage = this.initialPage();
      const islamicLibrary = this.getIslamicLibraryFromLocalStorage()?.find(item => item.storageKey === this.storageKey()) ?? null;
      if (overridePage && overridePage > 0) {
        this.page.set(overridePage);
        this.zoom.set(islamicLibrary?.zoom ?? 1);
      } else if (islamicLibrary) {
        this.page.set(islamicLibrary.page ?? 1);
        this.zoom.set(islamicLibrary.zoom ?? 1);
      }
    }
  }

  getIslamicLibraryFromLocalStorage(): IslamicLibrary[] | null {
    const libraryJson = localStorage.getItem('islamic_library');
    return libraryJson ? JSON.parse(libraryJson) : null;
  }

  nextPage() {
    if (this.page() >= this.totalPages()) return;
    this.page.update(value => value + 1);
  }

  prevPage() {
    if (this.page() <= 1) return;
    this.page.update(value => value - 1);
  }

  zoomIn() {
    if (this.zoom() >= 3) return;
    this.zoom.update(value => Math.min(value + 0.25, 3));
  }

  zoomOut() {
    if (this.zoom() <= 0.5) return;
    this.zoom.update(value => Math.max(value - 0.25, 0.5));
  }

  onError(event: any) {
    console.error('Error loading PDF', event);
  }

  afterLoadComplete(pdfData: PDFDocumentProxy) {
    const savedLibrary = this.getIslamicLibraryFromLocalStorage()?.find(item => item.storageKey === this.storageKey());
    
    const overridePage = this.initialPage();
    const targetPage = (overridePage && overridePage > 0) ? overridePage : (savedLibrary?.page ?? 1);
    const savedZoom = savedLibrary?.zoom ?? 1;

    this.page.set(targetPage > pdfData.numPages ? pdfData.numPages : targetPage); // Ensure valid page number
    this.zoom.set(savedZoom);
    this.totalPages.set(pdfData.numPages);
    this.isLoaded.set(true);
  }

  pageRendered = (e: CustomEvent) => {
    this.pagesRendered.update(value => value + 1);
    if (this.pagesRendered() === this.totalPages()) {
      this.isLoaded.set(true);
    }
  };

  onProgress(progressData: PDFProgressData) {
    this.progressData = progressData;
    this.isLoaded.set(progressData.loaded >= progressData.total);
  }

  updateIslamicLibrary(): void {
    if (isPlatformBrowser(this.platformId)) {
      const islamicLibrary = this.getIslamicLibraryFromLocalStorage();
      if (islamicLibrary) {
        const updatedLibrary = islamicLibrary
          .map(
            item => {
              if (item.storageKey === this.storageKey()) {
                return { ...item, page: this.page(), totalPage: this.totalPages() };
              }
              return item;
            }
          );
        localStorage.setItem('islamic_library', JSON.stringify(updatedLibrary));
      }
    }
  }

}
