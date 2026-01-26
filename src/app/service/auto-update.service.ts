import { Injectable, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoUpdateService {

  private lastUpdateCheck = signal<number>(0);
  private readonly UPDATE_COOLDOWN = 60 * 60 * 1000; // 1 hour
  updateAvailable = signal<boolean>(false);

  constructor(private swUpdate: SwUpdate) {
    this.initUpdateListener();
    this.schedulePeriodicChecks();
  }

  /**
   * Listen for version updates and notify user
   */
  private initUpdateListener(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker not enabled');
      return;
    }

    // Listen for version ready events
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(event => {
        console.log('New version available:', event.latestVersion);
        this.updateAvailable.set(true);
        this.promptUserToUpdate();
      });

    // Check for unrecoverable state
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('Unrecoverable state:', event.reason);
      this.forceReload();
    });
  }

  /**
   * Notify that update is available
   * The UI component will handle displaying the notification
   */
  private promptUserToUpdate(): void {
    // Signal is already set to true in initUpdateListener
    // The app component will display the notification
    console.log('Update available - notification signal set');
  }

  /**
   * Activate the update and reload
   */
  activateUpdate(): void {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.activateUpdate()
      .then(() => {
        console.log('Update activated, reloading...');
        this.forceReload();
      })
      .catch(err => {
        console.error('Failed to activate update:', err);
      });
  }

  /**
   * Force reload the page
   */
  private forceReload(): void {
    window.location.reload();
  }

  /**
   * Manually check for updates
   */
  checkForUpdate(): void {
    const now = Date.now();

    if ((now - this.lastUpdateCheck() > this.UPDATE_COOLDOWN) && this.swUpdate.isEnabled) {
      this.lastUpdateCheck.set(now);

      this.swUpdate.checkForUpdate()
        .then(updateFound => {
          if (updateFound) {
            console.log('Update found during manual check');
          } else {
            console.log('No updates available');
          }
        })
        .catch(err => {
          console.error('Error checking for updates:', err);
        });
    }
  }

  /**
   * Schedule periodic update checks (every 30 minutes)
   */
  private schedulePeriodicChecks(): void {
    if (!this.swUpdate.isEnabled) return;

    setInterval(() => {
      this.checkForUpdate();
    }, 30 * 60 * 1000); // Check every 30 minutes
  }

  /**
   * Dismiss the update notification
   */
  dismissUpdate(): void {
    this.updateAvailable.set(false);
    console.log('Update notification dismissed');
  }
}
