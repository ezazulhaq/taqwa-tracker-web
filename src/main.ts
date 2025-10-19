import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpsRedirectService } from './app/service/https-redirect.service';

// Enforce HTTPS before app initialization
const httpsService = new HttpsRedirectService();
httpsService.enforceHttps();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
