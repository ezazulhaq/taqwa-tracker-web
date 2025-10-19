import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  
  isMenuVisible = signal<boolean>(false);
  isSettingsVisible = signal<boolean>(false);

  constructor() { }

  toggleMenu() {
    this.isMenuVisible.update(value => !value);
  }

  toggleSettings() {
    this.isSettingsVisible.update(value => !value);
  }

  closeMenu() {
    this.isMenuVisible.set(false);
  }

  closeSettings() {
    this.isSettingsVisible.set(false);
  }
}
