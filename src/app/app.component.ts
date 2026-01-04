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
import { PreferenceSyncService } from './service/preference-sync.service';

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
  private prefSyncService = inject(PreferenceSyncService);

  constructor(
    private autoUpdateService: AutoUpdateService,
    protected themeSelector: ThemeSelectorService,
    private securityHeadersService: SecurityHeadersService
  ) { }

  ngOnInit(): void {
    this.prefSyncService.init();
    this.autoUpdateService.checkForUpdate();
    this.securityHeadersService.initializeSecurityHeaders();
  }

}
