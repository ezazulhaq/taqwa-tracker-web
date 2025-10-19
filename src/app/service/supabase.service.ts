import { effect, Injectable, signal, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js'
import { Observable, from, map, tap } from 'rxjs';
import { IslamicLibrary } from '../model/islamic-library.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {

    private authService = inject(AuthService);

    quranTranslator = signal<string>(localStorage.getItem('quranTranslator') || 'ahmedraza');

    hadithSource = signal<string>(localStorage.getItem('hadithSource') || 'Sahih Bukhari');

    constructor() {
        effect(() => {
            localStorage.setItem('quranTranslator', this.quranTranslator());
            localStorage.setItem('hadithSource', this.hadithSource());
        });
    }

    getQuranTranslators(): Observable<any> {
        return from(
            this.getClient()
                .from('translators')
                .select('name, full_name')
                .eq('is_active', true)
                .order('name', { ascending: true })
        );
    }

    /**
     * Method to call the 'get_surah_translation' stored procedure and return an Observable
     */
    getSurahTranslation(
        p_language_code: string,
        p_surah_id: number,
        p_translator_name: string
    ): Observable<any> {
        return from(
            this.getClient().rpc(
                'get_surah_translation',
                {
                    p_language_code,
                    p_surah_id,
                    p_translator_name
                }
            )
        );
    }

    /**
     * Get List of all the Surah
     * @returns Surah
     */
    getSurahList(): Observable<any> {
        return from(
            this.getClient()
                .from('surahs')
                .select('surah_id, name, name_transliteration, name_en, total_ayas')
                .order('surah_id', { ascending: true })
        );
    }

    /**
     * Searches for hadiths based on a given query text.
     * 
     * @param query - The search text to find relevant hadiths
     * @returns An Observable that emits the search results from the Supabase Edge Function
     * 
     * @example
     * // Example usage
     * this.supabaseService.searchHadith("give me importance of Salat")
     *   .subscribe(
     *     results => console.log(results),
     *     error => console.error(error)
     *   );
     * 
     * @remarks
     * - The function invokes a Supabase Edge Function named 'search_hadiths'
     * - Results are limited to 3 items per search
     * - The request body is automatically stringified before sending
     */
    searchHadith(query: string): Observable<any> {
        const body = {
            query: query,
            topK: 3
        };

        return from(
            this.getClient().functions
                .invoke(
                    'islamic_chatbot',
                    {
                        body: JSON.stringify(body)
                    }
                )
        );
    }

    /**
     * Retrieves a list of active hadith sources from the database.
     * 
     * @returns An Observable that emits the names of active hadith sources
     * 
     * @example
     * this.supabaseService.findActiveHadithSources()
     *   .subscribe(
     *     sources => console.log(sources),
     *     error => console.error('Failed to load sources:', error)
     *   );
     * 
     * @remarks
     * - Queries the 'sources' table and filters for records where 'is_active' is true
     * - Only selects the 'name' field from each record
     */
    findActiveHadithSources(): Observable<any> {
        return from(
            this.getClient()
                .from('sources')
                .select('name')
                .eq('is_active', true)
        );

    }

    /**
     * Method to call the 'get_chapter_info_by_source' stored procedure and return an Observable
     */
    getHadithChaptersFromSource(): Observable<any> {
        return from(
            this.getClient().rpc(
                'get_chapter_info_by_source',
                {
                    source_name: this.hadithSource()
                }
            )
        );
    }

    /**
     * Method to call the 'get_hadiths_by_chapter_id' stored procedure and return an Observable
     */
    getHadithByChapterId(
        input_chapter_id: string
    ): Observable<any> {
        return from(
            this.getClient().rpc(
                'get_hadiths_by_chapter_id',
                {
                    input_chapter_id
                }
            )
        );
    }

    /**
     * Method to call the 'get_hadith_details' stored procedure and return an Observable
     */
    getHadithDetailsFromId(
        hadith_id: string[]
    ): Observable<any> {
        return from(
            this.getClient().rpc(
                'get_hadith_details',
                {
                    hadith_id
                }
            )
        );
    }

    // Get client from AuthService
    private getClient(): SupabaseClient {
        return this.authService.getAuthenticatedClient();
    }

    // Call authenticated functions
    invokeAuthFunction(functionName: string, body?: any): Observable<any> {
        return from(
            this.getClient().functions.invoke(functionName, { body })
        );
    }

    // Query tables with authentication
    fromAuth(table: string) {
        return this.getClient().from(table);
    }
}