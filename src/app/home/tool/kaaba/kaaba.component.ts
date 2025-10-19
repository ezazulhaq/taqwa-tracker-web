import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { SalahAppService } from '../../../service/salah-app.service';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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

  heading$: BehaviorSubject<number>;
  kaabaDirection$: Observable<number | null>;
  private compassSubscription: Subscription | null = null;
  compassDeg = signal<number>(0);

  compassSvg: SafeHtml = '';
  private isIOS: boolean;

  constructor(
    private kaabaService: SalahAppService,
    private sanitizer: DomSanitizer) {
    this.heading$ = new BehaviorSubject<number>(0);
    this.kaabaDirection$ = this.kaabaService.getKaabaDirection();
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  ngOnInit() {
    this.requestOrientationPermission();
  }

  ngOnDestroy() {
    if (this.compassSubscription) {
      this.compassSubscription.unsubscribe();
    }
  }

  requestOrientationPermission() {
    if (this.isIOS) {
      if (typeof (window as any).DeviceOrientationEvent !== 'undefined' &&
        typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
        (window as any).DeviceOrientationEvent.requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              this.setupDeviceOrientation();
            } else {
              console.error('Permission to access device orientation was denied');
            }
          })
          .catch(console.error);
      } else {
        console.error('DeviceOrientationEvent.requestPermission is not available');
      }
    } else {
      this.setupDeviceOrientation();
    }
  }

  setupDeviceOrientation() {
    const win = window as any;
    if (typeof win !== 'undefined' && 'DeviceOrientationEvent' in win) {
      const handleOrientation = (event: ExtendedDeviceOrientationEvent) => {
        let heading: number | null = null;
        if (this.isIOS) {
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

      if (this.isIOS) {
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