import { SalahAppService } from '../../../service/salah-app.service';
import { CommonModule, DatePipe } from '@angular/common';
import { OpenStreetMapResponse } from '../../../model/open-stream-map.model';
import { NamazTimes } from '../../../model/namaz-time.model';
import { map } from 'rxjs/internal/operators/map';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { PrayerTimeInfo } from './prayer-times.model';
import { CalendarComponent } from "../../../shared/calendar/calendar.component";
import { RakatComponent } from './rakat/rakat.component';
import { TitleComponent } from '../../../shared/title/title.component';
import { NotificationService } from '../../../service/notification.service';
import { Component, linkedSignal, OnInit, signal, OnDestroy, computed } from '@angular/core';

@Component({
  selector: 'app-prayer-times',
  imports: [CommonModule, DatePipe, CalendarComponent, RakatComponent, TitleComponent],
  templateUrl: './prayer-times.component.html',
  styleUrl: './prayer-times.component.css',
  host: {
    'class': 'app-bg !bg-transparent dark:!bg-transparent relative isolate overflow-hidden'
  }
})
export class PrayerTimesComponent implements OnInit, OnDestroy {
  address = signal<string>("");

  isCalendarVisible = signal<boolean>(false);
  selectedDate = signal<Date>(new Date());

  haveLocationAccess = signal<boolean>(true);

  prayerName = signal<string>("");

  currentTime = signal<Date>(new Date());

  private timeUpdateInterval: any;

  // Signal to hold the raw prayer times for celestial calculations
  private rawPrayerTimes = signal<NamazTimes | null>(null);

  // Helper to get decimal hours from a Date object
  private getDecimalHours(date: Date): number {
    return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  }

  // Calculates continuous opacities for the 4 sky layers based on dynamic prayer times
  opacities = computed(() => {
    const time = this.currentTime();
    const hourFloat = this.getDecimalHours(time);
    const prayers = this.rawPrayerTimes();

    // Default to 6 AM / 6 PM if times aren't loaded yet
    const sunrise = prayers ? this.getDecimalHours(prayers.sunrise) : 6;
    const sunset = prayers ? this.getDecimalHours(prayers.maghrib) : 18;
    
    // Transitions usually start ~1 hour before the actual event
    const transitionDuration = 1.5; 

    let night = 0, dawn = 0, day = 0, sunsetOpacity = 0;

    if (hourFloat < sunrise - transitionDuration) {
      // Deep Night
      night = 1;
    } else if (hourFloat < sunrise) {
      // Night -> Dawn
      const progress = (hourFloat - (sunrise - transitionDuration)) / transitionDuration;
      night = 1 - progress;
      dawn = progress;
    } else if (hourFloat < sunrise + transitionDuration) {
      // Dawn -> Day
      const progress = (hourFloat - sunrise) / transitionDuration;
      dawn = 1 - progress;
      day = progress;
    } else if (hourFloat < sunset - transitionDuration) {
      // Full Day
      day = 1;
    } else if (hourFloat < sunset) {
      // Day -> Sunset
      const progress = (hourFloat - (sunset - transitionDuration)) / transitionDuration;
      day = 1 - progress;
      sunsetOpacity = progress;
    } else if (hourFloat < sunset + transitionDuration) {
      // Sunset -> Night
      const progress = (hourFloat - sunset) / transitionDuration;
      sunsetOpacity = 1 - progress;
      night = progress;
    } else {
      // Back to Night
      night = 1;
    }

    return { night, dawn, day, sunset: sunsetOpacity };
  });

  // Calculates the positions and opacities of the sun and moon along an arc
  celestialPositions = computed(() => {
    const time = this.currentTime();
    const hourFloat = this.getDecimalHours(time);
    const prayers = this.rawPrayerTimes();

    // Dynamic Sunrise and Sunset
    const sunrise = prayers ? this.getDecimalHours(prayers.sunrise) : 6;
    const sunset = prayers ? this.getDecimalHours(prayers.maghrib) : 18;

    // Sun arc: Rises at sunrise, Peaks in middle, Sets at sunset
    let sunX = 50;
    let sunY = 110; 
    let sunOpacity = 0;

    if (hourFloat >= sunrise && hourFloat <= sunset) {
      const progress = (hourFloat - sunrise) / (sunset - sunrise);
      sunX = progress * 100;
      // Parabola: vertex at 0.5 progress, peak height 10% from top
      sunY = 400 * Math.pow(progress - 0.5, 2) + 10;
      sunOpacity = 1;
    } else if (hourFloat >= sunrise - 0.5 && hourFloat < sunrise) {
      // Fading in just before sunrise
      sunX = 0;
      sunY = 110;
      sunOpacity = (hourFloat - (sunrise - 0.5)) * 2;
    } else if (hourFloat > sunset && hourFloat <= sunset + 0.5) {
      // Fading out just after sunset
      sunX = 100;
      sunY = 110;
      sunOpacity = 1 - (hourFloat - sunset) * 2;
    }

    // Moon arc: Rises at sunset, Peaks at midnight (roughly), Sets at sunrise
    let moonX = 50;
    let moonY = 110;
    let moonOpacity = 0;

    // Normalize moon cycle (sunset to sunrise next day)
    const moonStart = sunset;
    const moonEnd = sunrise + 24;
    const moonCurrent = hourFloat < sunset ? hourFloat + 24 : hourFloat;

    if (moonCurrent >= moonStart && moonCurrent <= moonEnd) {
      const progress = (moonCurrent - moonStart) / (moonEnd - moonStart);
      moonX = progress * 100;
      moonY = 400 * Math.pow(progress - 0.5, 2) + 10;
      moonOpacity = 1;
    } else if (moonCurrent >= moonStart - 0.5 && moonCurrent < moonStart) {
      moonX = 0;
      moonY = 110;
      moonOpacity = (moonCurrent - (moonStart - 0.5)) * 2;
    } else if (moonCurrent > moonEnd && moonCurrent <= moonEnd + 0.5) {
      moonX = 100;
      moonY = 110;
      moonOpacity = 1 - (moonCurrent - moonEnd) * 2;
    }

    return {
      sun: { x: sunX, y: sunY, opacity: sunOpacity },
      moon: { x: moonX, y: moonY, opacity: moonOpacity }
    };
  });

  getTimes = linkedSignal(() => {
    return this.prayerService.getPrayerTimes(this.selectedDate(), this.prayerService.isHanafi())
      .pipe(
        map((namazTimes: NamazTimes | null) => {
          this.rawPrayerTimes.set(namazTimes); // Store for celestial calculations
          if (!namazTimes) {
            return [];
          }

          const now = new Date();
          const sortedTimes: PrayerTimeInfo[] = Object.entries(namazTimes)
            .map(([key, value]) => {
              // Check if today is Friday and the key is dhuhr
              if (value.getDay() === 5 && key === 'dhuhr') {
                return { key: 'jummah', value: new Date(value), isClosest: false };
              } else {
                return { key, value: new Date(value), isClosest: false };
              }
            })
            .sort((a, b) => a.value.getTime() - b.value.getTime());

          // Find the closest future prayer time

          const closestFuturePrayer = sortedTimes.slice().reverse().find(prayer => prayer.value <= now && prayer.value.getDate() === now.getDate());
          if (closestFuturePrayer) {
            closestFuturePrayer.isClosest = true;
          }

          return sortedTimes;
        }),
        shareReplay(1) // Cache the result
      );
  });

  constructor(
    private prayerService: SalahAppService,
    protected notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // update time every minute to adjust gradient smoothly
    this.timeUpdateInterval = setInterval(() => {
      this.currentTime.set(new Date());
    }, 60000);

    // check if location access allowed
    navigator.geolocation.getCurrentPosition(() => {
      this.haveLocationAccess.set(true);
    }, () => {
      this.haveLocationAccess.set(false);
    });

    this.fetchAddress();
  }

  fetchAddress() {
    this.prayerService.getAddress().subscribe({
      next: (response: OpenStreetMapResponse | null) => {
        response
          ? this.address.set(response.display_name)
          : this.address.set("");
      },
      error: (error: any) => {
        console.error('Error fetching address:', error);
        this.address.set('Error fetching address');
      }
    });
  }

  changeSelectedDate(value: string) {
    const newDate = new Date(this.selectedDate());
    if (value === "next")
      newDate.setDate(newDate.getDate() + 1);
    else
      newDate.setDate(newDate.getDate() - 1);
    this.selectedDate.set(newDate);
  }

  onDateSelected(newDate: Date) {
    this.isCalendarVisible.set(false);
    this.selectedDate.set(newDate);
  }

  sendTestNotification() {
    this.notificationService.showNotification(
      'Test Notification',
      'If you see this, prayer alerts are working correctly!'
    );
  }

  ngOnDestroy(): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }
}

