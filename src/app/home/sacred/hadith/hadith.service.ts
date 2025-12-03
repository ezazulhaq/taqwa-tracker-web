import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
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
    const requests = hadithIds.map(id => this.getHadithDetailsFromId(id));
    return forkJoin(requests);
  }

  getHadithByChapterId(chapterId: string): Observable<HadithDetail[]> {
    return this.http.get<HadithDetail[]>(`${this.apiUrl}/hadith/hadiths/chapter/${chapterId}`);
  }

}
