import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpsRedirectService } from './app/service/https-redirect.service';
import { inject } from '@vercel/analytics';

// Enforce HTTPS before app initialization
const httpsService = new HttpsRedirectService();
httpsService.enforceHttps();

// Inject Vercel Analytics
inject();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
