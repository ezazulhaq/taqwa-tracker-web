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

