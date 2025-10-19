import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { PdfViewerComponent } from "../../../../shared/pdf-viewer/pdf-viewer.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reader',
  imports: [PdfViewerComponent],
  templateUrl: './reader.component.html',
  styleUrl: './reader.component.css',
  host: {
    class: 'app-bg'
  }
})
export class ReaderComponent {

  pdfSrc!: string;
  storageKey!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pdfSrc = `https://${environment.github.pdfUri}/${params['category']}/${params['pdfName']}`;
      this.storageKey = params['storageKey'];
    });
  }
}
