import { Component, computed, inject, signal } from '@angular/core';
import { TitleComponent } from '../shared/title/title.component';
import { PrayerTimesWidgetComponent } from './prayer-times-widget/prayer-times-widget.component';
import { RecommendedAppsWidgetComponent } from './recommended-apps-widget/recommended-apps-widget.component';
import { StreakDashboardComponent } from './streak-dashboard/streak-dashboard.component';
import { InstallPwaComponent } from '../shared/install-pwa/install-pwa.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    TitleComponent,
    PrayerTimesWidgetComponent,
    RecommendedAppsWidgetComponent,
    StreakDashboardComponent,
    InstallPwaComponent,
    WelcomeComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  host: {
    class: "app-bg"
  }
})
export class HomeComponent {

  private readonly authService = inject(AuthService);
  isAuthenticated = computed(() => this.authService.isAuthenticated());

}
