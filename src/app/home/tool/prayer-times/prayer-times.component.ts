import { Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SalahAppService } from '../../../service/salah-app.service';
import { CommonModule, DatePipe } from '@angular/common';
import { OpenStreetMapResponse } from '../../../model/open-stream-map.model';
import { NamazTimes } from '../../../model/namaz-time.model';
import { of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { PrayerTimeInfo } from './prayer-times.model';
import { CalendarComponent } from "../../../shared/calendar/calendar.component";
import { RakatComponent } from './rakat/rakat.component';
import { TitleComponent } from '../../../shared/title/title.component';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-prayer-times',
  imports: [CommonModule, DatePipe, CalendarComponent, RakatComponent, TitleComponent],
  templateUrl: './prayer-times.component.html',
  styleUrl: './prayer-times.component.css',
  host: {
    class: "app-bg"
  }
})
export class PrayerTimesComponent implements OnInit {
  private prayerService = inject(SalahAppService);
  protected notificationService = inject(NotificationService);

  address = toSignal(
    this.prayerService.getAddress().pipe(
      map(response => response?.display_name ?? ""),
      catchError(error => {
        console.error('Error fetching address:', error);
        return of('Error fetching address');
      })
    ),
    { initialValue: "" }
  );

  isCalendarVisible = signal<boolean>(false);
  selectedDate = signal<Date>(new Date());

  haveLocationAccess = signal<boolean>(true);

  prayerName = signal<string>("");

  getTimes = linkedSignal(() => {
    return this.prayerService.getPrayerTimes(this.selectedDate(), this.prayerService.isHanafi())
      .pipe(
        map((namazTimes: NamazTimes | null) => {
          if (!namazTimes) return [];

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

  constructor() { }

  ngOnInit(): void {
    // check if location access allowed
    navigator.geolocation.getCurrentPosition(() => {
      this.haveLocationAccess.set(true);
    }, () => {
      this.haveLocationAccess.set(false);
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
}

