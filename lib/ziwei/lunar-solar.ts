/**
 * Chuyển đổi qua lại giữa Âm lịch và Dương lịch (chuẩn múi giờ Việt Nam UTC+7).
 */
import { Lunar, LunarMonth, Solar } from 'lunar-javascript';

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

export interface LunarDate {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
}

export const LUNAR_YEAR_MIN = 1900;
export const LUNAR_YEAR_MAX = 2050;

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

/**
 * Số ngày của một tháng Âm lịch (29 hoặc 30 ngày).
 * Nếu tháng đó không tồn tại (ví dụ: không có tháng nhuận đó) thì trả về 0.
 */
export function lunarMonthDayCount(year: number, month: number, isLeapMonth = false): number {
  if (!isIntInRange(year, LUNAR_YEAR_MIN, LUNAR_YEAR_MAX) || !isIntInRange(month, 1, 12)) return 0;
  try {
    const lm = LunarMonth.fromYm(year, isLeapMonth ? -month : month);
    const dayCount = lm?.getDayCount();
    return typeof dayCount === 'number' && Number.isInteger(dayCount) && dayCount > 0 ? dayCount : 0;
  } catch {
    return 0;
  }
}

/**
 * Tháng nhuận của năm Âm lịch (1-12). Nếu không có tháng nhuận trả về 0.
 */
export function leapMonthOfLunarYear(year: number): number {
  if (!isIntInRange(year, LUNAR_YEAR_MIN, LUNAR_YEAR_MAX)) return 0;
  for (let month = 1; month <= 12; month++) {
    if (lunarMonthDayCount(year, month, true) > 0) return month;
  }
  return 0;
}

/**
 * Kiểm tra ngày Âm lịch có hợp lệ hay không.
 */
export function isValidLunarDate(year: number, month: number, day: number, isLeapMonth = false): boolean {
  if (!isIntInRange(day, 1, 30)) return false;
  const dayCount = lunarMonthDayCount(year, month, isLeapMonth);
  return dayCount > 0 && day <= dayCount;
}

/**
 * Chuyển đổi Âm lịch sang Dương lịch.
 */
export function lunarToSolar(year: number, month: number, day: number, isLeapMonth = false): SolarDate | null {
  if (!isValidLunarDate(year, month, day, isLeapMonth)) return null;
  try {
    const solar = Lunar.fromYmd(year, isLeapMonth ? -month : month, day).getSolar();
    const result = { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
    if (!Number.isInteger(result.year) || !Number.isInteger(result.month) || !Number.isInteger(result.day)) return null;
    return result;
  } catch {
    return null;
  }
}

/**
 * Chuyển đổi Dương lịch sang Âm lịch.
 */
export function solarToLunar(year: number, month: number, day: number): LunarDate | null {
  try {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    const rawMonth = Number(lunar.getMonth());
    return {
      lunarYear: Number(lunar.getYear()),
      lunarMonth: Math.abs(rawMonth),
      lunarDay: Number(lunar.getDay()),
      isLeapMonth: rawMonth < 0,
    };
  } catch {
    return null;
  }
}

/**
 * Chuyển đổi Âm lịch sang Dương lịch chuẩn Việt Nam (UTC+7).
 */
export const lunarToSolarVN = lunarToSolar;

/**
 * Chuyển đổi Dương lịch sang Âm lịch chuẩn Việt Nam (UTC+7).
 */
export const solarToLunarVN = solarToLunar;
