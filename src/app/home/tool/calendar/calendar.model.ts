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
    // Pre-computed display properties for performance
    eventBgColor?: string;
    eventTextColor?: string;
    eventBorderColor?: string;
    eventColor?: string;
    eventDetails?: IslamicEvent;
}

export interface IslamicEvent {
    month: number;
    day: number;
    name: string;
    description: string;
    type: 'major' | 'important' | 'special';
}
