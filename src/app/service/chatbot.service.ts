import { Injectable } from '@angular/core';
import { from, map, Observable, take, tap } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { SearchHadithResponse } from '../model/search-hadith.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private supabaseService: SupabaseService) { }

  queryIslam(query: string): Observable<SearchHadithResponse> {
    return from(this.supabaseService.searchHadith(query))
      .pipe(
        take(1),
        map((response: any) => response.data)
      );
  }
}
