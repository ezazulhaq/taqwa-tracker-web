import { Injectable, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class AutoUpdateService {

  private lastUpdateCheck = signal<number>(0);
  private readonly UPDATE_COOLDOWN = signal<number>(60 * 60 * 1000); // 1 hour

  constructor(private swUpdate: SwUpdate) {
    //this.scheduleUpdate();
  }

  checkForUpdate(): void {
    const now = Date.now();

    if ((now - this.lastUpdateCheck() > this.UPDATE_COOLDOWN())
      && this.swUpdate.isEnabled) {
      this.lastUpdateCheck.set(now);

      this.swUpdate.checkForUpdate()
        .then(
          () => {
            console.log('Checking for updates');
          }
        )
        .catch(
          (err: any) => {
            console.error('Error when checking for updates:', err);
          }
        );
    }
  }

  private scheduleUpdate(): void {
    setTimeout(() => {
      this.swUpdate.activateUpdate().then(() => {
        console.log('New version activated');
        window.location.reload();
      });
    }, 5000); // Wait for 5 seconds before applying the update
  }
}
