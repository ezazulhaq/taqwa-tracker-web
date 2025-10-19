import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './header/menu/menu.component';
import { ThemeSelectorService } from './service/theme.service';
import { AutoUpdateService } from './service/auto-update.service';
import { ScrollTopComponent } from './shared/scroll-top/scroll-top.component';
import { SettingsComponent } from './header/settings/settings.component';
import { HeaderComponent } from './header/header.component';
import { HeaderService } from './header/header.service';
import { SecurityHeadersService } from './service/security-headers.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MenuComponent,
    SettingsComponent,
    ScrollTopComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  headerService = inject(HeaderService);

  constructor(
    private autoUpdateService: AutoUpdateService,
    protected themeSelector: ThemeSelectorService,
    private securityHeadersService: SecurityHeadersService
  ) {
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme === 'dark' ? this.themeSelector.setDarkTheme() : this.themeSelector.setLightTheme();
    }
    else {
      this.themeSelector.setSystemTheme();
    }
  }

  ngOnInit(): void {
    this.autoUpdateService.checkForUpdate();
    this.securityHeadersService.initializeSecurityHeaders();
  }

}
