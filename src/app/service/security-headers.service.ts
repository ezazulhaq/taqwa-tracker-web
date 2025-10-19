import { Injectable } from '@angular/core';
import { SECURITY_CONFIG } from '../config/security.config';

@Injectable({
  providedIn: 'root'
})
export class SecurityHeadersService {

  initializeSecurityHeaders(): void {
    // Set CSP header via meta tag (only security header that can be set this way)
    this.setCSPMetaTag();

    // Disable right-click context menu in production
    if (this.isProduction()) {
      this.disableContextMenu();
    }

    // Prevent drag and drop of external content
    this.preventDragDrop();

    // Clear sensitive data on page unload
    this.setupPageUnloadHandler();
  }

  private setCSPMetaTag(): void {
    const csp = this.buildCSPString();
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }

  private buildCSPString(): string {
    const directives = SECURITY_CONFIG.CSP_DIRECTIVES;
    return Object.entries(directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
  }

  private disableContextMenu(): void {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
      return true;
    });
  }

  private preventDragDrop(): void {
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
  }

  private setupPageUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      // Clear sensitive data from memory
      this.clearSensitiveData();
    });
  }

  private clearSensitiveData(): void {
    // Clear any sensitive data from localStorage/sessionStorage if needed
    // This is handled by auth service, but can be extended
  }

  private isProduction(): boolean {
    return !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1');
  }

  validateExternalUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return SECURITY_CONFIG.ALLOWED_DOMAINS.some(domain =>
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }
}