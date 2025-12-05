import { effect, Injectable, signal, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js'
import { Observable, from, map, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {

    private authService = inject(AuthService);

    constructor() { }

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