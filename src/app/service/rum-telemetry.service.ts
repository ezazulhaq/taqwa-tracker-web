import { DestroyRef, Injectable, inject, isDevMode } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { environment } from '../../environments/environment';

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';
type DisplayMode = 'standalone' | 'browser' | 'unknown';

interface RumEventPayload {
  type: 'pageview' | 'vital' | 'error';
  route: string;
  name?: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
  value?: number;
  rating?: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  device_type: DeviceType;
  display_mode: DisplayMode;
  connection_type: string;
  detail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RumTelemetryService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly endpoint = `${environment.apiBaseUrl}/telemetry/rum`;
  private readonly queue: RumEventPayload[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private initialized = false;
  private errorCount = 0;

  init(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }
    this.initialized = true;

    // Observe SPA route transitions
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.enqueue({
          type: 'pageview',
          route: this.normalizeRoute(event.urlAfterRedirects || event.url),
          device_type: this.getDeviceType(),
          display_mode: this.getDisplayMode(),
          connection_type: this.getConnectionType(),
        });
      });

    // Observe Core Web Vitals
    const recordVital = (metric: Metric) => {
      const name = metric.name as RumEventPayload['name'];
      if (!name) return;
      this.enqueue({
        type: 'vital',
        route: this.normalizeRoute(this.router.url || window.location.pathname),
        name,
        value: Number(metric.value.toFixed(name === 'CLS' ? 4 : 2)),
        rating: metric.rating || 'unknown',
        device_type: this.getDeviceType(),
        display_mode: this.getDisplayMode(),
        connection_type: this.getConnectionType(),
      });
    };

    onLCP(recordVital);
    onINP(recordVital);
    onCLS(recordVital);
    onFCP(recordVital);
    onTTFB(recordVital);

    // Lightweight client error counter (capped per session)
    const onWindowError = (ev: ErrorEvent) => {
      this.captureClientError(ev.message || 'window_error');
    };
    const onUnhandledRejection = (ev: PromiseRejectionEvent) => {
      const reason = ev.reason instanceof Error ? ev.reason.message : String(ev.reason || 'unhandled_rejection');
      this.captureClientError(reason);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    };
    const onPageHide = () => this.flush();

    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      this.flush();
    });
  }

  private captureClientError(detail: string): void {
    if (this.errorCount >= 10) {
      return;
    }
    this.errorCount += 1;
    this.enqueue({
      type: 'error',
      route: this.normalizeRoute(this.router.url || window.location.pathname),
      detail: detail.slice(0, 200),
      device_type: this.getDeviceType(),
      display_mode: this.getDisplayMode(),
      connection_type: this.getConnectionType(),
    });
  }

  private enqueue(event: RumEventPayload): void {
    if (isDevMode() && typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '4200') {
      // Avoid polluting production API telemetry during ng serve unless talking to local API
      if (!environment.apiBaseUrl.includes('localhost') && !environment.apiBaseUrl.includes('127.0.0.1')) {
        return;
      }
    }

    this.queue.push(event);
    if (this.queue.length >= 10) {
      this.flush();
      return;
    }
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), 2000);
    }
  }

  private flush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.queue.length === 0) {
      return;
    }

    const batch = this.queue.splice(0, 25);
    try {
      void fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch }),
        keepalive: true,
      }).catch(() => {
        // Silently ignore telemetry delivery failures (e.g. offline PWA mode)
      });
    } catch {
      // Ignore unexpected browser fetch errors
    }
  }

  private normalizeRoute(rawUrl: string): string {
    const cleaned = (rawUrl || '/').split('?')[0].split('#')[0] || '/';
    return cleaned
      .replace(/\/\d+(?=\/|$)/g, '/:id')
      .replace(/\/[0-9a-fA-F-]{8,}(?=\/|$)/g, '/:id')
      .slice(0, 96);
  }

  private getDeviceType(): DeviceType {
    const width = window.innerWidth || 0;
    if (width <= 0) return 'unknown';
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getDisplayMode(): DisplayMode {
    if (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) {
      return 'standalone';
    }
    const nav = window.navigator as Navigator & { standalone?: boolean };
    if (nav.standalone === true) {
      return 'standalone';
    }
    return 'browser';
  }

  private getConnectionType(): string {
    const nav = window.navigator as Navigator & { connection?: { effectiveType?: string } };
    return nav.connection?.effectiveType || 'unknown';
  }
}
