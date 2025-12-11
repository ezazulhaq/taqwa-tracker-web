import { effect, Injectable, signal, inject } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { Observable, from, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {

    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            environment.supabase.url,
            environment.supabase.anonKey
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

    // Get client - note: this will use Supabase's own auth, not our custom auth
    // If you want to completely remove Supabase, you'll need to migrate the chatbot functionality
    private getClient(): SupabaseClient {
        return this.supabase;
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