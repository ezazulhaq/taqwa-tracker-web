import { Component, HostListener, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-install-pwa',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './install-pwa.component.html',
    styleUrl: './install-pwa.component.css'
})
export class InstallPwaComponent implements OnInit {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    deferredPrompt: any;
    showInstallBanner = signal(false);
    platform = signal<'android' | 'ios' | 'other'>('other');

    ngOnInit() {
        if (this.isBrowser) {
            this.detectPlatform();
            this.checkIfInstalled();
        }
    }

    detectPlatform() {
        if (!this.isBrowser) return;
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            this.platform.set('ios');
        } else if (/android/.test(userAgent)) {
            this.platform.set('android');
        } else {
            this.platform.set('other');
        }
    }

    checkIfInstalled() {
        if (!this.isBrowser) return;

        // Check if the app is already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        // Check if it was dismissed and if 7 days have passed
        const dismissedAt = localStorage.getItem('pwa_install_dismissed_at');
        let isDismissed = false;

        if (dismissedAt) {
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
            const now = new Date().getTime();
            const dismissedTime = parseInt(dismissedAt, 10);

            if (now - dismissedTime < sevenDaysInMs) {
                isDismissed = true;
            } else {
                // Clear if expired
                localStorage.removeItem('pwa_install_dismissed_at');
            }
        }

        if (!isStandalone && !isDismissed) {
            // Delay to not annoy user immediately
            setTimeout(() => {
                if (this.platform() === 'ios' || this.deferredPrompt) {
                    this.showInstallBanner.set(true);
                }
            }, 5000);
        }
    }

    @HostListener('window:beforeinstallprompt', ['$event'])
    onBeforeInstallPrompt(e: Event) {
        if (!this.isBrowser) return;

        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;

        // If not in standalone and not dismissed within last 7 days, show banner
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const dismissedAt = localStorage.getItem('pwa_install_dismissed_at');
        let isDismissed = false;

        if (dismissedAt) {
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
            const now = new Date().getTime();
            const dismissedTime = parseInt(dismissedAt, 10);
            if (now - dismissedTime < sevenDaysInMs) {
                isDismissed = true;
            }
        }

        if (!isStandalone && !isDismissed) {
            this.showInstallBanner.set(true);
        }
    }

    async installPwa() {
        if (!this.isBrowser || !this.deferredPrompt) return;

        // Show the install prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the PWA install prompt');
            this.showInstallBanner.set(false);
        }
        this.deferredPrompt = null;
    }

    dismiss() {
        if (!this.isBrowser) return;

        this.showInstallBanner.set(false);
        // Remember dismissal for 7 days
        const now = new Date().getTime();
        localStorage.setItem('pwa_install_dismissed_at', now.toString());
        // Clean up legacy key
        localStorage.removeItem('pwa_install_dismissed');
    }
}
