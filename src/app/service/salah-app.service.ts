import { Injectable, signal } from '@angular/core';
import { Coordinates, PrayerTimes, CalculationMethod, Qibla, Madhab, Shafaq, SunnahTimes } from 'adhan';
import { NamazTimes } from '../model/namaz-time.model';
import { HttpClient } from '@angular/common/http';
import { OpenStreetMapResponse } from '../model/open-stream-map.model';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class SalahAppService {
  private locationSubject = new BehaviorSubject<{ latitude: number, longitude: number } | null>(null);
  private errorSubject = new BehaviorSubject<string | null>(null);

  location$ = this.locationSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  isHanafi = signal<boolean>(false);
  hijriOffset = signal<number>(0);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.getLocation();
    this.setupDailyNotificationScheduling();
    this.loadHanafiPreference();
    this.loadHijriOffsetPreference();
  }

  private loadHanafiPreference() {
    const savedPreference = localStorage.getItem('hanafiPreference');
    if (savedPreference !== null) {
      this.isHanafi.set(savedPreference === 'true');
    }
  }

  private loadHijriOffsetPreference() {
    const savedPreference = localStorage.getItem('hijriOffset');
    if (savedPreference !== null) {
      this.hijriOffset.set(parseInt(savedPreference, 10));
    } else {
      // Smart Default: If no preference is saved, check timezone
      // South Asian countries (India, Pakistan, Bangladesh) are typically +5:00 to +6:00
      // This is a rough estimation based on timezone offset
      const tzOffset = new Date().getTimezoneOffset();

      // -330 mins = +5:30 (India)
      // -300 mins = +5:00 (Pakistan)
      // -360 mins = +6:00 (Bangladesh)
      if (tzOffset <= -300 && tzOffset >= -360) {
        this.hijriOffset.set(-1);
      } else {
        this.hijriOffset.set(0);
      }
    }
  }

  toggleHanafi() {
    const newValue = !this.isHanafi();
    this.isHanafi.set(newValue);
    localStorage.setItem('hanafiPreference', newValue.toString());
  }

  setHijriOffset(offset: number) {
    this.hijriOffset.set(offset);
    localStorage.setItem('hijriOffset', offset.toString());
  }

  private setupDailyNotificationScheduling() {
    this.location$.subscribe(location => {
      if (location) {
        this.getPrayerTimes(new Date()).subscribe(times => {
          if (times) {
            this.notificationService.schedulePrayerNotifications(times);
          }
        });
      }
    });
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.locationSubject.next(location);
          this.errorSubject.next(null);
        },
        (error) => {
          let errorMsg: string;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Please enable location permissions for this site in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMsg = "The request to get user location timed out.";
              break;
            default:
              errorMsg = "An unknown error occurred.";
              break;
          }
          this.errorSubject.next(errorMsg);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      this.errorSubject.next("Geolocation is not supported by this browser.");
    }
  }

  getPrayerTimes(date: Date, isHanafi?: boolean): Observable<NamazTimes | null> {
    const hanafiVal = isHanafi !== undefined ? isHanafi : this.isHanafi();
    return this.location$.pipe(
      map(location => {
        if (!location) return null;
        const coordinates = new Coordinates(location.latitude, location.longitude);

        // Use MoonsightingCommittee for Hanafi (supports Shafaq for Isha)
        // Use MuslimWorldLeague for non-Hanafi (widely used standard)
        const params = hanafiVal
          ? CalculationMethod.MoonsightingCommittee()
          : CalculationMethod.MuslimWorldLeague();

        // Set Madhab for Asr calculation
        // Hanafi: Later Asr time (shadow length = 2x object height + Zuhr shadow)
        // Shafi: Earlier Asr time (shadow length = 1x object height + Zuhr shadow)
        params.madhab = hanafiVal ? Madhab.Hanafi : Madhab.Shafi;

        // Set Shafaq for Isha calculation (only effective with MoonsightingCommittee)
        // Hanafi: Abyad (white twilight) - Later Isha time
        // Shafi/Maliki/Hanbali: Ahmer (red twilight) - Earlier Isha time
        if (hanafiVal) {
          params.shafaq = Shafaq.Abyad;
        }

        const prayerTimes = new PrayerTimes(coordinates, date, params);

        // Calculate Sunnah times for Tahajjud (night prayer)
        const sunnahTimes = new SunnahTimes(prayerTimes);

        return {
          fajr: prayerTimes.fajr,
          sunrise: prayerTimes.sunrise,
          dhuhr: prayerTimes.dhuhr,
          asr: prayerTimes.asr,
          maghrib: prayerTimes.maghrib,
          isha: prayerTimes.isha,
          tahajjud: sunnahTimes.lastThirdOfTheNight, // Best time for Tahajjud prayer
        };
      })
    );
  }

  getAddress(): Observable<OpenStreetMapResponse | null> {
    return this.location$.pipe(
      switchMap(location => {
        if (!location) return of(null);
        const url = `${environment.api.map}?format=json&lat=${location.latitude}&lon=${location.longitude}`;
        return this.http.get<OpenStreetMapResponse>(url);
      }),
      catchError(error => {
        console.error('Error fetching address:', error);
        return of(null);
      })
    );
  }

  // Calculate Kaaba direction
  getKaabaDirection(): Observable<number | null> {
    return this.location$.pipe(
      map(location => {
        if (!location) return null;
        // Create coordinates object
        const coordinates = new Coordinates(location.latitude, location.longitude);
        // Calculate Qibla direction
        const qibla = Qibla(coordinates);
        // Return the Qibla direction in degrees
        return qibla ?? 0;
      })
    );
  }

}
