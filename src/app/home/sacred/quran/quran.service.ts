import { Injectable, effect, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Surah, Ayah, Translator } from "./quran.model";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class QuranService {
    private http = inject(HttpClient);
    private readonly API_BASE_URL = environment.apiBaseUrl;

    quranTranslator = signal<string>(localStorage.getItem('quranTranslator') || 'ahmedraza');

    constructor() {
        effect(() => {
            localStorage.setItem('quranTranslator', this.quranTranslator());
        });
    }

    getAllSurahs(): Observable<Surah[]> {
        return this.http.get<Surah[]>(`${this.API_BASE_URL}/quran/surahs`);
    }

    getAllAyahs(surahNo: number, translator: string): Observable<Ayah[]> {
        return this.http.get<Ayah[]>(`${this.API_BASE_URL}/quran/ayahs?surah_no=${surahNo}&translator=${encodeURIComponent(translator)}`);
    }

    getQuranTranslators(languageCode: string = 'en', activeOnly: boolean = true): Observable<Translator[]> {
        return this.http.get<Translator[]>(`${this.API_BASE_URL}/quran/translators?language_code=${languageCode}&active_only=${activeOnly}`)
            .pipe(map(translators => translators.map(t => ({ name: t.name, full_name: t.full_name }))));
    }
}