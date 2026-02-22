import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { PdfViewerComponent } from '../../../../shared/pdf-viewer/pdf-viewer.component';
import { ReadStreakService } from '../../../../service/read-streak.service';
import { AuthTokenService } from '../../../../service/auth-token.service';
import { ReadItem } from '../../../streak-dashboard/streak-dashboard.model';

@Component({
  selector: 'app-reader',
  imports: [PdfViewerComponent],
  templateUrl: './reader.component.html',
  styleUrl: './reader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-bg'
  }
})
export class ReaderComponent implements OnDestroy {

  pdfSrc!: string;
  storageKey!: string;
  initialPage = signal<number | undefined>(undefined);

  private pdfName = '';
  private category = '';
  private currentPage = 1;
  private hasTrackedInitial = false;

  private readonly route = inject(ActivatedRoute);
  private readonly readStreakService = inject(ReadStreakService);
  private readonly authTokenService = inject(AuthTokenService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pdfName = params['pdfName'] ?? '';
      this.category = params['category'] ?? '';
      this.storageKey = params['storageKey'] ?? '';
      const pageParam = params['page'];
      if (pageParam) {
        this.initialPage.set(+pageParam);
        this.currentPage = +pageParam;
      }
      this.pdfSrc = `https://${environment.github.pdfUri}/${this.category}/${this.pdfName}`;

      // Track initial read (count=1) only once
      if (!this.hasTrackedInitial) {
        this.trackReading(1);
        this.hasTrackedInitial = true;
      }
    });
  }

  ngOnDestroy() {
    // Update streak link with latest page (count=0 to avoid double counting)
    if (this.authTokenService.isAuthenticated()) {
      this.trackReading(0);
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  private trackReading(count: number): void {
    if (!this.pdfName || !this.authTokenService.isAuthenticated()) return;

    const link = `/reader?pdfName=${encodeURIComponent(this.pdfName)}&category=${encodeURIComponent(this.category)}&storageKey=${encodeURIComponent(this.storageKey)}&page=${this.currentPage}`;

    const readItem: ReadItem = {
      type: 'library',
      title: this.formatTitle(this.pdfName),
      subtitle: this.formatTitle(this.category),
      link,
      timestamp: new Date().toISOString()
    };

    this.readStreakService.trackRead(count, readItem);
  }

  private formatTitle(value: string): string {
    return value
      .replace(/[-_]/g, ' ')
      .replace(/\.(pdf|PDF)$/i, '')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
