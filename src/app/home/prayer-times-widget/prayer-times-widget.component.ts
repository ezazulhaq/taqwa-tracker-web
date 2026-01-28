import { ChangeDetectionStrategy, Component, computed, inject, signal, effect, viewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalahAppService } from '../../service/salah-app.service';
import { NamazTimes } from '../../model/namaz-time.model';
import moment from 'moment-hijri';

@Component({
  selector: 'app-prayer-times-widget',
  imports: [DatePipe, RouterLink],
  templateUrl: './prayer-times-widget.component.html',
  styleUrl: './prayer-times-widget.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrayerTimesWidgetComponent {
  private salahService = inject(SalahAppService);
  scrollContainer = viewChild<ElementRef>('scrollContainer');
  private lastScrolledPrayer = '';

  // Writable signal for prayer times
  times = signal<NamazTimes | null>(null);

  // Signal for current time (updates every minute for live countdown)
  currentTime = signal(new Date());

  // Effect to reactively update times when isHanafi changes
  constructor() {
    effect(() => {
      // This effect tracks isHanafi() and re-runs when it changes
      const isHanafi = this.salahService.isHanafi();
      this.salahService.getPrayerTimes(new Date(), isHanafi).subscribe(times => {
        this.times.set(times);
      });
    });

    // Update current time every minute for live countdown
    setInterval(() => {
      this.currentTime.set(new Date());
    }, 60000); // Update every 60 seconds

    // Scroll to current prayer when it changes
    effect(() => {
      const prayers = this.prayers();
      const currentPrayer = prayers.find(p => p.isCurrent);
      const container = this.scrollContainer();

      if (container && currentPrayer && currentPrayer.name !== this.lastScrolledPrayer) {
        this.lastScrolledPrayer = currentPrayer.name;
        // Use timeout to ensure DOM is updated
        setTimeout(() => {
          const currentElement = container.nativeElement.querySelector('.current-prayer-card');
          if (currentElement) {
            currentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }, 300);
      }
    });
  }

  currentDate = signal(new Date());

  hijriDate = computed(() => {
    return moment(this.currentDate()).format('iMMMM iD, iYYYY') + ' AH';
  });

  // Computed signal to process prayer times into a view model and determine the current prayer
  prayers = computed(() => {
    const t = this.times();
    if (!t) return [];

    const now = this.currentTime();
    const prayerList = [
      { name: 'Fajr', time: t.fajr, date: this.createDateFromTime(t.fajr) },
      { name: 'Sunrise', time: t.sunrise, date: this.createDateFromTime(t.sunrise) },
      { name: 'Dhuhr', time: t.dhuhr, date: this.createDateFromTime(t.dhuhr) },
      { name: 'Asr', time: t.asr, date: this.createDateFromTime(t.asr) },
      { name: 'Maghrib', time: t.maghrib, date: this.createDateFromTime(t.maghrib) },
      { name: 'Isha', time: t.isha, date: this.createDateFromTime(t.isha) },
      { name: 'Tahajjud', time: t.tahajjud, date: this.createDateFromTime(t.tahajjud) },
    ];

    // Find the next prayer (first prayer time that is in the future)
    const nextPrayerIndex = prayerList.findIndex(p => p.date >= now);

    // Determine current prayer index
    // If we found a next prayer, current is the one before it
    // If no next prayer found (all passed), current is the last prayer (Isha)
    let currentPrayerIndex: number;
    if (nextPrayerIndex === -1) {
      // All prayers have passed, we're in Isha time
      currentPrayerIndex = prayerList.length - 1;
    } else if (nextPrayerIndex === 0) {
      // Next prayer is Fajr, we're still in Isha from yesterday
      currentPrayerIndex = prayerList.length - 1;
    } else {
      // We're in the time between the previous prayer and the next one
      currentPrayerIndex = nextPrayerIndex - 1;
    }

    return prayerList.map((p, index) => ({
      ...p,
      isCurrent: index === currentPrayerIndex
    }));
  });

  // Computed signal for time remaining until next prayer
  timeRemaining = computed(() => {
    const prayerList = this.prayers();
    if (prayerList.length === 0) return null;

    const now = this.currentTime();
    const nextPrayer = prayerList.find(p => p.date >= now);

    if (!nextPrayer) {
      // All prayers passed, next is Fajr tomorrow
      return null;
    }

    const diffMs = nextPrayer.date.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
      name: nextPrayer.name,
      hours,
      minutes,
      formatted: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    };
  });

  private createDateFromTime(dateObj: Date): Date {
    // The adhan library returns full Date objects, so we can use them directly for comparison
    return new Date(dateObj);
  }

  getCardClass(isCurrent: boolean): string {
    return isCurrent
      ? 'bg-emerald-600 shadow-md scale-105 border-0'
      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700';
  }

  getTextClass(isCurrent: boolean, type: 'name' | 'time'): string {
    if (isCurrent) return 'text-white';
    return type === 'name' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200';
  }
}
