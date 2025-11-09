import { Moment } from 'moment-hijri';

export interface CalendarDay {
    gregorianDate: Moment;
    hijriDate: string;
    hijriDay: number;
    hijriMonth: string;
    hijriMonthNumber: number;
    hijriYear: number;
    gregorianDay: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isFriday: boolean;
    hasEvent: boolean;
    eventName?: string;
    eventType?: 'major' | 'important' | 'special';
}

export interface IslamicEvent {
    month: number;
    day: number;
    name: string;
    description: string;
    type: 'major' | 'important' | 'special';
}