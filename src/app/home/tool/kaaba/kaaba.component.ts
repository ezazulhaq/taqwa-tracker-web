import { Component, OnDestroy, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SalahAppService } from '../../../service/salah-app.service';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { SafeHtml } from '@angular/platform-browser';
import { TitleComponent } from '../../../shared/title/title.component';

// Extended DeviceOrientationEvent interface to include webkitCompassHeading
interface ExtendedDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

@Component({
  selector: 'app-kaaba',
  imports: [
    TitleComponent,
  ],
  templateUrl: './kaaba.component.html',
  styleUrl: './kaaba.component.css',
  host: {
    class: 'app-bg'
  }
})
export class KaabaComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  heading$: BehaviorSubject<number>;
  kaabaDirection$: Observable<number | null>;
  private compassSubscription: Subscription | null = null;
  compassDeg = signal<number>(0);

  isIOS = signal<boolean>(false);
  isPermissionRequired = signal<boolean>(false);
  isPermissionGranted = signal<boolean>(false);

  constructor(
    private kaabaService: SalahAppService) {
    this.heading$ = new BehaviorSubject<number>(0);
    this.kaabaDirection$ = this.kaabaService.getKaabaDirection();

    if (this.isBrowser) {
      this.isIOS.set(/iPad|iPhone|iPod/.test(navigator.userAgent));
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkOrientationPermission();
    }
  }

  ngOnDestroy() {
    if (this.compassSubscription) {
      this.compassSubscription.unsubscribe();
    }
  }

  checkOrientationPermission() {
    if (!this.isBrowser) return;

    if (this.isIOS()) {
      if (typeof (window as any).DeviceOrientationEvent !== 'undefined' &&
        typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
        // Permission is required on iOS 13+
        this.isPermissionRequired.set(true);
      } else {
        // Fallback for older iOS or non-standard browsers
        console.warn('DeviceOrientationEvent.requestPermission is not available on this iOS device.');
        this.setupDeviceOrientation();
      }
    } else {
      // Android or Desktop
      this.isPermissionGranted.set(true);
      this.setupDeviceOrientation();
    }
  }

  onEnableCompass() {
    if (!this.isBrowser) return;

    if (typeof (window as any).DeviceOrientationEvent !== 'undefined' &&
      typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
      (window as any).DeviceOrientationEvent.requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            this.isPermissionGranted.set(true);
            this.isPermissionRequired.set(false);
            this.setupDeviceOrientation();
          } else {
            console.error('Permission to access device orientation was denied');
          }
        })
        .catch(console.error);
    }
  }

  setupDeviceOrientation() {
    if (!this.isBrowser) return;

    const win = window as any;
    if (typeof win !== 'undefined' && ('DeviceOrientationEvent' in win || 'ondeviceorientationabsolute' in win)) {
      const handleOrientation = (event: ExtendedDeviceOrientationEvent) => {
        let heading: number | null = null;
        if (this.isIOS()) {
          // For iOS devices
          heading = event.webkitCompassHeading ?? null;
        } else if (event.alpha !== null) {
          // For Android devices
          heading = 360 - event.alpha;
        }

        if (heading !== null) {
          this.heading$.next(heading);
        }
      };

      if (this.isIOS()) {
        win.addEventListener('deviceorientation', handleOrientation as EventListener, true);
      } else if ('ondeviceorientationabsolute' in win) {
        win.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      } else {
        win.addEventListener('deviceorientation', handleOrientation as EventListener, true);
      }

      this.compassSubscription = combineLatest([this.heading$, this.kaabaDirection$])
        .pipe(
          map(([heading, kaabaDirection]) => {
            if (heading !== null && kaabaDirection !== null) {
              return (kaabaDirection - heading + 360) % 360;
            }
            return null;
          })
        )
        .subscribe(relativeDirection => {
          if (relativeDirection !== null) {
            this.compassDeg.set(relativeDirection);
          }
        });
    } else {
      console.error('Device orientation is not supported by this device.');
    }
  }
}

interface ExtendedDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}