import { Component, computed, OnInit, signal } from '@angular/core';
import { CalendarDay, IslamicEvent } from './calendar.model';
import moment from 'moment-hijri';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../../../shared/title/title.component';

@Component({
  selector: 'app-islamic-calendar',
  imports: [
    CommonModule,
    TitleComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  host: {
    class: "app-bg"
  }
})
export class IslamicCalendarComponent implements OnInit {
  currentDate = signal(moment());
  calendarDays = signal<CalendarDay[]>([]);
  selectedDay = signal<CalendarDay | null>(null);
  showUpcomingEvents = signal(false);

  hijriMonths = [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhul-Qi\'dah', 'Dhul-Hijjah'
  ];

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  islamicEvents: IslamicEvent[] = [
    { month: 1, day: 1, name: 'Islamic New Year', description: 'First day of Muharram, beginning of the Islamic calendar year', type: 'major' },
    { month: 1, day: 10, name: 'Day of Ashura', description: 'Day of fasting commemorating Prophet Musa (AS) and the Israelites', type: 'major' },
    { month: 3, day: 12, name: 'Mawlid al-Nabi', description: 'Birth of Prophet Muhammad (ﷺ)', type: 'major' },
    { month: 7, day: 27, name: 'Isra and Mi\'raj', description: 'The Night Journey and Ascension of Prophet Muhammad (ﷺ)', type: 'major' },
    { month: 8, day: 15, name: 'Mid-Sha\'ban', description: 'Night of seeking forgiveness and blessings', type: 'important' },
    { month: 9, day: 1, name: 'First Day of Ramadan', description: 'Beginning of the blessed month of fasting', type: 'major' },
    { month: 9, day: 15, name: 'Mid-Ramadan', description: 'Halfway through the blessed month', type: 'special' },
    { month: 9, day: 21, name: 'Last 10 Nights Begin', description: 'Start of the most blessed nights, seek Laylat al-Qadr', type: 'important' },
    { month: 9, day: 27, name: 'Laylat al-Qadr (est.)', description: 'The Night of Power, better than 1000 months', type: 'major' },
    { month: 10, day: 1, name: 'Eid al-Fitr', description: 'Festival of Breaking the Fast', type: 'major' },
    { month: 10, day: 2, name: 'Eid al-Fitr', description: 'Second day of Eid celebration', type: 'major' },
    { month: 10, day: 3, name: 'Eid al-Fitr', description: 'Third day of Eid celebration', type: 'major' },
    { month: 12, day: 1, name: 'Start of Dhul-Hijjah', description: 'Beginning of the sacred month of Hajj', type: 'important' },
    { month: 12, day: 8, name: 'Day of Tarwiyah', description: 'Pilgrims proceed to Mina', type: 'special' },
    { month: 12, day: 9, name: 'Day of Arafah', description: 'The best day of the year, pilgrims stand at Arafah', type: 'major' },
    { month: 12, day: 10, name: 'Eid al-Adha', description: 'Festival of Sacrifice', type: 'major' },
    { month: 12, day: 11, name: 'Tashriq Day 1', description: 'Days of Tashriq, remembrance of Allah', type: 'important' },
    { month: 12, day: 12, name: 'Tashriq Day 2', description: 'Days of Tashriq, remembrance of Allah', type: 'important' },
    { month: 12, day: 13, name: 'Tashriq Day 3', description: 'Days of Tashriq, remembrance of Allah', type: 'important' }
  ];

  currentMonthName = computed(() => {
    return this.currentDate().format('MMMM YYYY');
  });

  currentHijriMonth = computed(() => {
    const date = this.currentDate();
    return `${date.format('iMMMM')} ${date.format('iYYYY')}`;
  });

  upcomingEvents = computed(() => {
    const today = moment();
    const nextThreeMonths = moment().add(3, 'months');

    const events: Array<{ event: IslamicEvent, date: moment.Moment, daysUntil: number }> = [];

    // Check events in the next 3 months
    for (let i = 0; i <= 90; i++) {
      const checkDate = moment().add(i, 'days');
      const hijriMonth = parseInt(checkDate.format('iM'));
      const hijriDay = parseInt(checkDate.format('iD'));

      const event = this.islamicEvents.find(e =>
        e.month === hijriMonth && e.day === hijriDay
      );

      if (event) {
        events.push({
          event,
          date: checkDate,
          daysUntil: i
        });
      }
    }

    return events.slice(0, 5); // Return next 5 events
  });

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const date = this.currentDate();
    const startOfMonth = moment(date).startOf('month');
    const endOfMonth = moment(date).endOf('month');

    const startDate = moment(startOfMonth).startOf('week');
    const endDate = moment(endOfMonth).endOf('week');

    const days: CalendarDay[] = [];
    const today = moment();

    let currentDay = moment(startDate);

    while (currentDay.isSameOrBefore(endDate)) {
      days.push(this.createCalendarDay(currentDay, date.month()));
      currentDay = moment(currentDay).add(1, 'day');
    }

    this.calendarDays.set(days);
  }

  createCalendarDay(date: moment.Moment, currentMonth: number): CalendarDay {
    const hijriDay = parseInt(date.format('iD'));
    const hijriMonth = parseInt(date.format('iM'));
    const hijriMonthName = date.format('iMMMM');
    const hijriYear = parseInt(date.format('iYYYY'));
    const gregorianDay = date.date();

    const isCurrentMonth = date.month() === currentMonth;
    const isToday = date.isSame(moment(), 'day');
    const isFriday = date.day() === 5;

    const event = this.islamicEvents.find(e =>
      e.month === hijriMonth && e.day === hijriDay
    );

    return {
      gregorianDate: moment(date),
      hijriDate: `${hijriDay} ${hijriMonthName}`,
      hijriDay,
      hijriMonth: hijriMonthName,
      hijriMonthNumber: hijriMonth,
      hijriYear,
      gregorianDay,
      isCurrentMonth,
      isToday,
      isFriday,
      hasEvent: !!event,
      eventName: event?.name,
      eventType: event?.type
    };
  }

  previousMonth() {
    this.currentDate.set(moment(this.currentDate()).subtract(1, 'month'));
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.set(moment(this.currentDate()).add(1, 'month'));
    this.generateCalendar();
  }

  goToToday() {
    this.currentDate.set(moment());
    this.generateCalendar();
  }

  selectDay(day: CalendarDay) {
    this.selectedDay.set(day);
  }

  closeModal() {
    this.selectedDay.set(null);
  }

  toggleUpcomingEvents() {
    this.showUpcomingEvents.update(value => !value);
  }

  getEventDetails(day: CalendarDay): IslamicEvent | undefined {
    return this.islamicEvents.find(e =>
      e.month === day.hijriMonthNumber &&
      e.day === day.hijriDay
    );
  }

  getEventColor(type?: 'major' | 'important' | 'special'): string {
    switch (type) {
      case 'major': return 'bg-amber-500';
      case 'important': return 'bg-emerald-500';
      case 'special': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }

  getEventBorderColor(type?: 'major' | 'important' | 'special'): string {
    switch (type) {
      case 'major': return 'border-amber-200 dark:border-amber-800';
      case 'important': return 'border-emerald-200 dark:border-emerald-800';
      case 'special': return 'border-blue-200 dark:border-blue-800';
      default: return 'border-gray-200 dark:border-gray-800';
    }
  }

  getEventBgColor(type?: 'major' | 'important' | 'special'): string {
    switch (type) {
      case 'major': return 'bg-amber-50 dark:bg-amber-900/20';
      case 'important': return 'bg-emerald-50 dark:bg-emerald-900/20';
      case 'special': return 'bg-blue-50 dark:bg-blue-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
  }

  getEventTextColor(type?: 'major' | 'important' | 'special'): string {
    switch (type) {
      case 'major': return 'text-amber-900 dark:text-amber-300';
      case 'important': return 'text-emerald-900 dark:text-emerald-300';
      case 'special': return 'text-blue-900 dark:text-blue-300';
      default: return 'text-gray-900 dark:text-gray-300';
    }
  }

  getDaysUntilText(days: number): string {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  }
}