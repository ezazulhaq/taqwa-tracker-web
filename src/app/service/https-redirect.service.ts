import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpsRedirectService {

  enforceHttps(): void {
    if (environment.production && this.shouldRedirectToHttps()) {
      const httpsUrl = window.location.href.replace('http://', 'https://');
      window.location.replace(httpsUrl);
    }
  }

  private shouldRedirectToHttps(): boolean {
    return window.location.protocol === 'http:' && 
           !this.isLocalhost() && 
           !this.isHttpsAlready();
  }

  private isLocalhost(): boolean {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.') ||
           hostname.startsWith('172.');
  }

  private isHttpsAlready(): boolean {
    return window.location.protocol === 'https:';
  }

  checkSecureConnection(): boolean {
    return this.isHttpsAlready() || this.isLocalhost();
  }
}