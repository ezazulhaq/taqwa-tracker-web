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

  // Calculates continuous opacities for the 4 sky layers based on exact time
  opacities = computed(() => {
    const time = this.currentTime();
    const hourFloat = time.getHours() + time.getMinutes() / 60;

    // Default opacities
    let night = 0, dawn = 0, day = 0, sunset = 0;

    // Define peak times for each state
    const peakNight1 = 0;   // 12:00 AM
    const peakDawn = 6;     // 6:00 AM
    const peakDay = 12;     // 12:00 PM
    const peakSunset = 18;  // 6:00 PM
    const peakNight2 = 24;  // 12:00 AM (next day)

    if (hourFloat >= peakNight1 && hourFloat < peakDawn) {
      // Night -> Dawn
      const progress = hourFloat / peakDawn;
      night = 1 - progress;
      dawn = progress;
    } else if (hourFloat >= peakDawn && hourFloat < peakDay) {
      // Dawn -> Day
      const progress = (hourFloat - peakDawn) / (peakDay - peakDawn);
      dawn = 1 - progress;
      day = progress;
    } else if (hourFloat >= peakDay && hourFloat < peakSunset) {
      // Day -> Sunset
      const progress = (hourFloat - peakDay) / (peakSunset - peakDay);
      day = 1 - progress;
      sunset = progress;
    } else {
      // Sunset -> Night
      const progress = (hourFloat - peakSunset) / (peakNight2 - peakSunset);
      sunset = 1 - progress;
      night = progress;
    }

    return { night, dawn, day, sunset };
  });

  // Calculates the positions and opacities of the sun and moon along an arc
  celestialPositions = computed(() => {
    const time = this.currentTime();
    const hourFloat = time.getHours() + time.getMinutes() / 60;

    // Sun arc: Rises at 6am (x=0%), Peaks at 12pm (x=50%, y=10%), Sets at 6pm (x=100%)
    const sunStart = 6;
    const sunEnd = 18;
    let sunX = 50;
    let sunY = 110; // Below horizon
    let sunOpacity = 0;

    if (hourFloat >= sunStart && hourFloat <= sunEnd) {
      const progress = (hourFloat - sunStart) / (sunEnd - sunStart);
      sunX = progress * 100;
      // Parabola: y = a*(x-h)^2 + k. Vertex (h,k) at (0.5, 10). Roots at 0 and 1 (110).
      // 110 = a*(0 - 0.5)^2 + 10  => 100 = a * 0.25 => a = 400
      sunY = 400 * Math.pow(progress - 0.5, 2) + 10;
      sunOpacity = 1;
    } else if (hourFloat >= sunStart - 1 && hourFloat < sunStart) {
      // Fading in just before sunrise
      sunX = 0;
      sunY = 110;
      sunOpacity = hourFloat - (sunStart - 1);
    } else if (hourFloat > sunEnd && hourFloat <= sunEnd + 1) {
      // Fading out just after sunset
      sunX = 100;
      sunY = 110;
      sunOpacity = 1 - (hourFloat - sunEnd);
    }

    // Moon arc: Rises at 6pm (18:00), Peaks at 12am (0:00/24:00), Sets at 6am
    let moonX = 50;
    let moonY = 110;
    let moonOpacity = 0;

    // Normalize hour for moon arc (18 to 30)
    const moonHour = hourFloat < 12 ? hourFloat + 24 : hourFloat;
    const moonStart = 18;
    const moonEnd = 30; // 6 AM next day

    if (moonHour >= moonStart && moonHour <= moonEnd) {
      const progress = (moonHour - moonStart) / (moonEnd - moonStart);
      moonX = progress * 100;
      moonY = 400 * Math.pow(progress - 0.5, 2) + 10;
      moonOpacity = 1;
    } else if (moonHour >= moonStart - 1 && moonHour < moonStart) {
      moonX = 0;
      moonY = 110;
      moonOpacity = moonHour - (moonStart - 1);
    } else if (moonHour > moonEnd && moonHour <= moonEnd + 1) {
      moonX = 100;
      moonY = 110;
      moonOpacity = 1 - (moonHour - moonEnd);
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

