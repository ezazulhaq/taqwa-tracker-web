import { Injectable, signal } from '@angular/core';
import { Tasbih } from '../model/tasbih.model';
import { tasbihs } from '../home/tool/tasbih/tasbih.contant';

@Injectable({
  providedIn: 'root'
})
export class TasbihService {

  private readonly STORAGE_KEY = 'tasbih_counters';

  tasbihList = signal<Tasbih[]>([]);

  private defaultTasbihs: Tasbih[] = tasbihs;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const tasbihs = JSON.parse(storedData);
        this.tasbihList.set(tasbihs);
      } else {
        // Initialize with default tasbihs if none exists
        this.tasbihList.set(this.defaultTasbihs);
        this.saveToStorage(this.defaultTasbihs);
      }
    } catch (error) {
      console.error('Error loading tasbihs from storage:', error);
      this.tasbihList.set(this.defaultTasbihs);
    }
  }

  private saveToStorage(tasbihs: Tasbih[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasbihs));
    } catch (error) {
      console.error('Error saving tasbihs to storage:', error);
    }
  }

  getTasbihById(id: string): Tasbih | undefined {
    return this.tasbihList().find(tasbih => tasbih.id === id);
  }

  incrementCount(id: string): void {
    const tasbihs = this.tasbihList().map(tasbih => {
      if (tasbih.id === id) {
        return { ...tasbih, count: tasbih.count + 1 };
      }
      return tasbih;
    });

    this.tasbihList.set(tasbihs);
    this.saveToStorage(tasbihs);
  }

  resetCount(id: string): void {
    const tasbihs = this.tasbihList().map(tasbih => {
      if (tasbih.id === id) {
        return { ...tasbih, count: 0 };
      }
      return tasbih;
    });

    this.tasbihList.set(tasbihs);
    this.saveToStorage(tasbihs);
  }

  addTasbih(tasbih: Tasbih): void {
    const tasbihs = [...this.tasbihList(), tasbih];
    this.tasbihList.set(tasbihs);
    this.saveToStorage(tasbihs);
  }

  updateTasbih(updatedTasbih: Tasbih): void {
    const tasbihs = this.tasbihList().map(tasbih => {
      if (tasbih.id === updatedTasbih.id) {
        return updatedTasbih;
      }
      return tasbih;
    });

    this.tasbihList.set(tasbihs);
    this.saveToStorage(tasbihs);
  }

  deleteTasbih(id: string): void {
    const tasbihs = this.tasbihList().filter(tasbih => tasbih.id !== id);
    this.tasbihList.set(tasbihs);
    this.saveToStorage(tasbihs);
  }

}
