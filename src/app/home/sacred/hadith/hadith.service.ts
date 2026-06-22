import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HadithChapters, HadithSource, HadithDetail } from './hadith.model';


@Injectable({
  providedIn: 'root',
})
export class HadithService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  hadithSource = signal<string>(localStorage.getItem('hadithSource') || 'Sahih Bukhari');

  constructor() {
    effect(() => {
      localStorage.setItem('hadithSource', this.hadithSource());
    });
  }

  findActiveHadithSources(): Observable<HadithSource[]> {
    return this.http.get<HadithSource[]>(`${this.apiUrl}/hadith/sources`)
      .pipe(map(sources => sources.filter(source => source.is_active)));
  }

  getHadithChaptersFromSource(sourceName: string): Observable<HadithChapters[]> {
    return this.http.get<HadithChapters[]>(`${this.apiUrl}/hadith/chapters?source_name=${encodeURIComponent(sourceName)}`);
  }

  getHadithDetailsFromId(hadithId: string): Observable<HadithDetail> {
    return this.http.get<HadithDetail>(`${this.apiUrl}/hadith/hadiths/${hadithId}`);
  }

  getHadithDetailsByIds(hadithIds: string[]): Observable<HadithDetail[]> {
    if (hadithIds.length === 0) {
      return of([]);
    }
    let params = new HttpParams();
    hadithIds.forEach(id => {
      params = params.append('ids', id);
    });
    return this.http.get<HadithDetail[]>(`${this.apiUrl}/hadith/hadiths/batch`, { params });
  }


  getHadithByChapterId(chapterId: string): Observable<HadithDetail[]> {
    return this.http.get<HadithDetail[]>(`${this.apiUrl}/hadith/hadiths/chapter/${chapterId}`);
  }

  searchHadith(query: string, topK: number = 10, sourceName?: string): Observable<HadithDetail[]> {
    let url = `${this.apiUrl}/hadith/search?query=${encodeURIComponent(query)}&top_k=${topK}`;
    if (sourceName) {
      url += `&source_name=${encodeURIComponent(sourceName)}`;
    }
    return this.http.get<HadithDetail[]>(url);
  }
}
