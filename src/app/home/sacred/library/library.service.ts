import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Category, IslamicLibrary, LibraryItem } from './library.model';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  private getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/library/categories`)
      .pipe(map(categories => categories.filter(category => category.is_active)));
  }

  private getItemsByCategory(categoryId: number): Observable<LibraryItem[]> {
    return this.http.get<LibraryItem[]>(`${this.apiUrl}/library/items?category_id=${categoryId}`)
      .pipe(map(items => items.filter(item => item.is_active)));
  }

  /**
  * Retrieves a list of Islamic library items from the API.
  * Filters items where 'is_active' is true and maps the response data to the IslamicLibrary interface.
  * @returns An Observable emitting an array of IslamicLibrary objects.
  */
  getIslamicLibrary(): Observable<IslamicLibrary[]> {
    return this.getCategories().pipe(
      switchMap((categories: Category[]) => {
        if (categories.length === 0) {
          return of([]);
        }
        const itemRequests = categories.map(category =>
          this.getItemsByCategory(category.id)
        );
        return forkJoin(itemRequests).pipe(
          map((itemArrays: LibraryItem[][]) => itemArrays.flat())
        );
      }),
      map((items: any[]) => {
        return items.map((item: any) => ({
          name: item.name,
          pdfName: item.pdf_name,
          category: item.category_name,
          storageKey: item.storage_key
        }));
      }),
      map((library: IslamicLibrary[]) => this.addPageToLibraryItems(library)),
      tap((library: IslamicLibrary[]) => this.saveToLocalStorage(library))
    );
  }

  private addPageToLibraryItems(library: IslamicLibrary[]): IslamicLibrary[] {
    return library
      .map(
        item => {
          const storedPage = localStorage.getItem(item.storageKey!);
          const page = storedPage ? +storedPage : 1;
          return { ...item, page };
        }
      );
  }

  private saveToLocalStorage(library: IslamicLibrary[]): void {
    const libraryData = localStorage.getItem('islamic_library');

    if (!libraryData) {
      library.map(
        item => {
          return {
            ...item,
            page: 1,
            totalPage: 0
          };
        }
      );
      localStorage.setItem('islamic_library', JSON.stringify(library));
    }
  }
}
