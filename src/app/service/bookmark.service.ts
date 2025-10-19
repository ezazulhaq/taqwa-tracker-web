import { Injectable, signal } from '@angular/core';
import { BookMarkedSurah } from '../model/surah.model';
import { Hadiths } from '../home/sacred/hadith/hadith.model';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private bookmarkedHadiths = signal<Set<string>>(new Set());

  private bookmarkedAyahs = signal<Set<BookMarkedSurah>>(new Set());

  constructor() {
    this.loadFromStorageHadith();
    this.loadFromStorageAyah();
  }

  isBookmarkedHadith(hadithId: string): boolean {
    return this.bookmarkedHadiths().has(hadithId);
  }

  toggleBookmarkHadith(hadith: Hadiths) {
    this.bookmarkedHadiths.update(bookmarked => {
      const newBookmarked = new Set(bookmarked);
      if (newBookmarked.has(hadith.id)) {
        newBookmarked.delete(hadith.id);
      } else {
        newBookmarked.add(hadith.id);
      }
      return newBookmarked;
    });
    this.saveToStorageHadith();
  }

  getBookmarkedHadiths(): string[] {
    const saved = localStorage.getItem('bookmarkedHadiths');
    if (saved) {
      try {
        const bookmarks = JSON.parse(saved);
        return Array.isArray(bookmarks) ? bookmarks : [];
      } catch (error) {
        console.error('Error parsing bookmarks:', error);
        return [];
      }
    }
    return [];
  }

  private saveToStorageHadith() {
    localStorage.setItem('bookmarkedHadiths',
      JSON.stringify(Array.from(this.bookmarkedHadiths())));
  }

  private loadFromStorageHadith() {
    try {
      const saved = localStorage.getItem('bookmarkedHadiths');
      if (saved) {
        // Parse the JSON and ensure we have an array before creating Set
        const savedArray = JSON.parse(saved);
        if (Array.isArray(savedArray)) {
          this.bookmarkedHadiths.set(new Set(savedArray));
        } else {
          this.bookmarkedHadiths.set(new Set());
        }
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      this.bookmarkedHadiths.set(new Set());
    }
  }

  isBookmarkedAyah(bookmarked: BookMarkedSurah): boolean {
    // Using Array.from() to convert Set to Array, then use some() to check existence
    return Array.from(this.bookmarkedAyahs()).some(item =>
      item.surah_id === bookmarked.surah_id &&
      item.ayah_id === bookmarked.ayah_id
    );
  }

  toggleBookmarkAyah(bookMarkedSurah: BookMarkedSurah) {
    this.bookmarkedAyahs.update(bookmarked => {
      const newBookmarked = new Set(bookmarked);

      // Find if an equivalent item exists
      const exists = Array.from(newBookmarked).some(item =>
        item.surah_id === bookMarkedSurah.surah_id &&
        item.ayah_id === bookMarkedSurah.ayah_id
      );

      if (exists) {
        // Remove the existing item
        Array.from(newBookmarked).forEach(item => {
          if (item.surah_id === bookMarkedSurah.surah_id &&
            item.ayah_id === bookMarkedSurah.ayah_id) {
            newBookmarked.delete(item);
          }
        });
      } else {
        newBookmarked.add(bookMarkedSurah);
      }
      return newBookmarked;
    });
    this.saveToStorageAyah();
  }

  getBookmarkedAyah(): BookMarkedSurah[] {
    const saved = localStorage.getItem('bookmarkedAyahs');
    if (saved) {
      try {
        const bookmarks = JSON.parse(saved);
        return Array.isArray(bookmarks) ? bookmarks : [];
      } catch (error) {
        console.error('Error parsing bookmarks:', error);
        return [];
      }
    }
    return [];
  }

  private saveToStorageAyah() {
    localStorage.setItem('bookmarkedAyahs',
      JSON.stringify(Array.from(this.bookmarkedAyahs())));
  }

  private loadFromStorageAyah() {
    try {
      const saved = localStorage.getItem('bookmarkedAyahs');
      if (saved) {
        // Parse the JSON and ensure we have an array before creating Set
        const savedArray = JSON.parse(saved);
        if (Array.isArray(savedArray)) {
          this.bookmarkedAyahs.set(new Set(savedArray));
        } else {
          this.bookmarkedAyahs.set(new Set());
        }
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      this.bookmarkedAyahs.set(new Set());
    }
  }

  removeHadithBookmark(hadith: Hadiths){
    this.bookmarkedHadiths.update(bookmarked => {
      const newBookmarked = new Set(bookmarked);
      newBookmarked.delete(hadith.id);
      return newBookmarked;
    });
    this.saveToStorageHadith();
  }

  removeAyahBookmark(bookMarkedSurah: BookMarkedSurah){
    this.bookmarkedAyahs.update(bookmarked => {
      const newBookmarked = new Set(bookmarked);
      Array.from(newBookmarked).forEach(item => {
        if (item.surah_id === bookMarkedSurah.surah_id &&
          item.ayah_id === bookMarkedSurah.ayah_id) {
          newBookmarked.delete(item);
        }
      });
      return newBookmarked;
    });
    this.saveToStorageAyah();
  }
}
