import * as jalali from 'jalaali-js';

export interface JalaliDay {
    jy: number;
    jm: number;
    jd: number;
    isCurrentMonth: boolean;
    gregorian: Date;
}

export function buildJalaliMonth(year: number, month: number): JalaliDay[] {
    const gFirst = jalali.toGregorian(year, month, 1);
    const firstDate = new Date(gFirst.gy, gFirst.gm - 1, gFirst.gd);
    const weekdayOffset = (firstDate.getDay() + 1) % 7; // saturday => 0
    const monthLength = jalali.jalaaliMonthLength(year, month);
    const days: JalaliDay[] = []

    for (let i = 0; i < weekdayOffset; i++) {
        const d = new Date(firstDate);
        d.setDate(d.getDate() - (weekdayOffset - i));
        const { jy, jm, jd } = jalali.toJalaali(d);
        days.push({ jy, jm, jd, isCurrentMonth: false, gregorian: d });
    }

    for (let d = 1; d <= monthLength; d++) {
        const g = jalali.toGregorian(year, month, d);
        const gDate = new Date(g.gy, g.gm - 1, g.gd);
        days.push({ jy: year, jm: month, jd: d, isCurrentMonth: true, gregorian: gDate });
    }
    while (days.length % 7 !== 0) {
        const last = days[days.length - 1].gregorian;
        const next = new Date(last);
        next.setDate(next.getDate() + 1);
        const { jy, jm, jd } = jalali.toJalaali(next);
        days.push({ jy, jm, jd, isCurrentMonth: false, gregorian: next });
    }

    return days;

}