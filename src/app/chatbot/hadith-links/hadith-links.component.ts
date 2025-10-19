import { Component, input } from '@angular/core';
import { HadithReference } from '../../model/search-hadith.model';

@Component({
  selector: 'app-hadith-links',
  imports: [],
  templateUrl: './hadith-links.component.html',
  styleUrl: './hadith-links.component.css'
})
export class HadithLinksComponent {

  hadithLinks = input.required<HadithReference[]>();

}
