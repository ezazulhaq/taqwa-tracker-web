import { Component, linkedSignal, OnInit, signal } from '@angular/core';
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
  address = signal<string>("");

  isCalendarVisible = signal<boolean>(false);
  selectedDate = signal<Date>(new Date());

  haveLocationAccess = signal<boolean>(true);

  prayerName = signal<string>("");

  isHanafi = signal<boolean>(false);

  getTimes = linkedSignal(() => {
    return this.prayerService.getPrayerTimes(this.selectedDate(), this.isHanafi())
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

  constructor(
    private prayerService: SalahAppService
  ) { 
    // Load saved preference from localStorage
    const savedPreference = localStorage.getItem('hanafiPreference');
    if (savedPreference !== null) {
      this.isHanafi.set(savedPreference === 'true');
    }
  }

  ngOnInit(): void {
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

  toggleHanafi() {
    const newValue = !this.isHanafi();
    this.isHanafi.set(newValue);
    // Save preference to localStorage
    localStorage.setItem('hanafiPreference', newValue.toString());
  }
}

