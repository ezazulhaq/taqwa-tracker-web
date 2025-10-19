import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderService } from '../header.service';
import { AuthService } from '../../service/auth.service';
import { version } from '../../../../package.json'
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    TitleCasePipe,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  headerService = inject(HeaderService);
  authService = inject(AuthService);

  userName = linkedSignal(
    () => this.authService.isAuthenticated()
      ? this.authService.userMetaData()?.username
      : "guest user"
  );

  protected localMenuVisible = signal(false);

  protected readonly appVersion: string = version;

  constructor() {
    effect(
      () => {
        this.localMenuVisible.set(this.headerService.isMenuVisible());
      }
    );
  }

  onMenuItemClick() {
    this.headerService.closeMenu();
  }

  onLogOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.onMenuItemClick();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
