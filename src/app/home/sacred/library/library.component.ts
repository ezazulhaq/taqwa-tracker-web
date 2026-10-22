import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { IslamicLibrary } from '../../../model/islamic-library.model';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ReplaceUnderlinePipe } from '../../../pipes/replace-underline.pipe';
import { TitleComponent } from '../../../shared/title/title.component';
import { LibraryService } from './library.service';

@Component({
  selector: 'app-library',
  imports: [
    TitleCasePipe,
    ReplaceUnderlinePipe,
    RouterLink,
    TitleComponent,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-bg'
  }
})
export class LibraryComponent {

  islamic_library = signal<IslamicLibrary[]>([]);
  openCategoryIndex = signal<number | null>(null);

  categories = computed(() => [...new Set(this.islamic_library().map(item => item.category))]);

  constructor(
    private readonly libraryService: LibraryService,
  ) { }

  ngOnInit() {
    this.libraryService.getIslamicLibrary().subscribe(
      {
        next: data => {
          this.islamic_library.set(data);
        },
        error: error => {
          console.error(error);
        }
      }
    );
  }

  getCategories() {
    return this.categories();
  }

  getCategoryItems(category: string) {
    return this.islamic_library().filter(item => item.category === category);
  }

  toggleCategory(index: number, event: Event) {
    event.preventDefault();
    const detailsElements = document.querySelectorAll('details');

    if (this.openCategoryIndex() === index) {
      detailsElements[index].removeAttribute('open');
      this.openCategoryIndex.set(null);
    } else {
      detailsElements.forEach((details, i) => {
        if (i !== index) details.removeAttribute('open');
      });
      detailsElements[index].setAttribute('open', '');
      this.openCategoryIndex.set(index);
    }
  }

  onToggle(event: Event, index: number) {
    const target = event.target as HTMLDetailsElement;
    if (!target.open && this.openCategoryIndex() === index) {
      this.openCategoryIndex.set(null);
    }
  }

}
