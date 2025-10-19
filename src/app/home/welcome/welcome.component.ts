import { Component, inject, linkedSignal, output, signal } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  private readonly authService = inject(AuthService);

  showIntro = signal<boolean>(true);

  isAuthenticated = linkedSignal(() => this.authService.isAuthenticated());

  constructor() {
    const intro = localStorage.getItem('showIntro');
    this.showIntro.set(intro !== 'false');
  }

  closeIntro() {
    this.showIntro.set(false);
  }

  hideWelcome() {
    this.showIntro.set(false);
    localStorage.setItem('showIntro', 'false');
  }

}
