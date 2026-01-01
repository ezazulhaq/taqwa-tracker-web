import { Injectable, signal } from '@angular/core';
import { NamazTimes } from '../model/namaz-time.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private timers: any[] = [];
    notificationsEnabled = signal<boolean>(false);
    permissionStatus = signal<NotificationPermission>('default');

    constructor() {
        this.checkPermission();
    }

    private checkPermission() {
        if ('Notification' in window) {
            this.permissionStatus.set(Notification.permission);
            this.notificationsEnabled.set(Notification.permission === 'granted');
        }
    }

    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications.');
            return false;
        }

        const permission = await Notification.requestPermission();
        this.permissionStatus.set(permission);
        const isGranted = permission === 'granted';
        this.notificationsEnabled.set(isGranted);
        return isGranted;
    }

    schedulePrayerNotifications(times: NamazTimes) {
        this.clearAllTimers();

        if (!this.notificationsEnabled()) return;

        const now = new Date();

        Object.entries(times).forEach(([key, time]) => {
            // Skip sunrise as it's not a prayer time (technically) but we could include it if desired
            if (key === 'sunrise') return;

            const prayerTime = new Date(time);
            const delay = prayerTime.getTime() - now.getTime();

            if (delay > 0) {
                const timer = setTimeout(() => {
                    this.showNotification(
                        'Prayer Time',
                        `It's time for ${key.charAt(0).toUpperCase() + key.slice(1)} prayer.`
                    );
                }, delay);
                this.timers.push(timer);
            }
        });
    }

    showNotification(title: string, body: string) {
        if (this.notificationsEnabled()) {
            new Notification(title, {
                body: body,
                icon: '/assets/icons/icon-192x192.png' // Adjust icon path if needed
            });
        }
    }

    clearAllTimers() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
}
