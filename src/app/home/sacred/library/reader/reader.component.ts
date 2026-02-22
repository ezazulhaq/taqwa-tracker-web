import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { PdfViewerComponent } from '../../../../shared/pdf-viewer/pdf-viewer.component';
import { ReadStreakService } from '../../../../service/read-streak.service';
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
export class ReaderComponent {

  pdfSrc!: string;
  storageKey!: string;

  private pdfName = '';
  private category = '';

  private readonly route = inject(ActivatedRoute);
  private readonly readStreakService = inject(ReadStreakService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pdfName = params['pdfName'] ?? '';
      this.category = params['category'] ?? '';
      this.storageKey = params['storageKey'] ?? '';
      this.pdfSrc = `https://${environment.github.pdfUri}/${this.category}/${this.pdfName}`;
      this.trackReading();
    });
  }

  private trackReading(): void {
    if (!this.pdfName) return;

    const link = `/reader?pdfName=${encodeURIComponent(this.pdfName)}&category=${encodeURIComponent(this.category)}&storageKey=${encodeURIComponent(this.storageKey)}`;

    const readItem: ReadItem = {
      type: 'library',
      title: this.formatTitle(this.pdfName),
      subtitle: this.formatTitle(this.category),
      link,
      timestamp: new Date().toISOString()
    };

    this.readStreakService.trackRead(1, readItem);
  }

  private formatTitle(value: string): string {
    return value
      .replace(/[-_]/g, ' ')
      .replace(/\.(pdf|PDF)$/i, '')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
