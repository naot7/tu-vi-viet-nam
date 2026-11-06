/**
 * Thuật toán tính Chân Thái Dương Thời (True Solar Time) chuẩn cho Việt Nam.
 *
 * Múi giờ chuẩn Việt Nam: UTC+7 (utcOffsetMinutes = 420 phút, kinh tuyến chuẩn 105°E).
 * Độ lệch Chân Thái Dương = Độ lệch kinh độ + Phương trình thời gian (Equation of Time - EoT).
 * Độ lệch kinh độ = (kinh độ nơi sinh − 105°) × 4 phút.
 * EoT tính theo công thức NOAA Spencer.
 * Độ chính xác tính toán hỗ trợ đến từng giây (ss).
 */

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

export type LateZishiRule = 'next-day' | 'current-day' | 'all-current' | 'day-cur-time-next';

export interface TrueSolarTimeInput extends GregorianDate {
  clockHour: number;
  clockMinute: number;
  clockSecond?: number;
  /** Kinh độ Đông nơi sinh (degrees East). Không truyền sẽ giữ nguyên giờ đồng hồ. */
  longitude?: number;
  /** Độ lệch chuẩn múi giờ theo phút (UTC+7 = 420 phút). Mặc định là 420 (chuẩn Việt Nam). */
  utcOffsetMinutes?: number;
}

export interface TrueSolarTimeResult {
  dateValid: boolean;
  corrected: boolean;
  longitudeCorrectionMinutes: number;
  equationOfTimeMinutes: number;
  totalCorrectionMinutes: number;
  rawMinutes: number;
  normalizedMinutes: number;
  dayOffset: number;
  hour: number;
  minute: number;
  second: number;
  branch: number;
}

const SECONDS_PER_DAY = 86400;
const mod = (value: number, base: number) => ((value % base) + base) % base;

export function isValidGregorianDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function shiftGregorianDate(date: GregorianDate, dayOffset: number): GregorianDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + dayOffset));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

export function sameGregorianDate(a: GregorianDate, b: GregorianDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function dayOfYear(year: number, month: number, day: number): number {
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86_400_000);
}

/**
 * Tính Phương trình thời gian (Equation of Time - EoT) theo công thức NOAA (trả về phút).
 * Giá trị dương nghĩa là Mặt Trời thực đi qua kinh tuyến sớm hơn Mặt Trời trung bình.
 */
export function equationOfTimeMinutes(
  year: number,
  month: number,
  day: number,
  clockHour = 12,
  clockMinute = 0,
): number {
  if (!isValidGregorianDate(year, month, day)) return 0;
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const fractionalHour = clockHour + clockMinute / 60;
  const gamma = (2 * Math.PI / daysInYear)
    * (dayOfYear(year, month, day) - 1 + (fractionalHour - 12) / 24);
  return 229.18 * (
    0.000075
    + 0.001868 * Math.cos(gamma)
    - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma)
    - 0.040849 * Math.sin(2 * gamma)
  );
}

/**
 * Xác định chỉ số Địa Chi (0 = Tý ... 11 = Hợi) từ số phút trong ngày của Chân Thái Dương Thời.
 * Tý: 23:00 - 01:00 (1380 - 1440 và 0 - 60 phút)
 * Sửu: 01:00 - 03:00 (60 - 180 phút)
 */
export function branchFromSolarMinutes(normalizedMinutes: number): number {
  if (normalizedMinutes >= 1380 || normalizedMinutes < 60) return 0;
  return Math.floor((normalizedMinutes - 60) / 120) + 1;
}

/**
 * Tính Chân Thái Dương Thời chi tiết đến từng giây.
 */
export function calculateTrueSolarTime(input: TrueSolarTimeInput): TrueSolarTimeResult {
  const dateValid = isValidGregorianDate(input.year, input.month, input.day);
  const corrected = input.longitude !== undefined && Number.isFinite(input.longitude);

  // Kinh tuyến chuẩn: Mặc định 105°E tương ứng chuẩn múi giờ Việt Nam UTC+7 (420 phút)
  const meridian = input.utcOffsetMinutes !== undefined && Number.isFinite(input.utcOffsetMinutes)
    ? input.utcOffsetMinutes / 4
    : 105;

  const longitudeCorrectionMinutes = corrected ? (input.longitude! - meridian) * 4 : 0;
  const eot = corrected && dateValid
    ? equationOfTimeMinutes(input.year, input.month, input.day, input.clockHour, input.clockMinute)
    : 0;

  const totalCorrectionMinutes = longitudeCorrectionMinutes + eot;
  const sec = input.clockSecond !== undefined && Number.isFinite(input.clockSecond) ? input.clockSecond : 0;
  const rawMinutes = input.clockHour * 60 + input.clockMinute + sec / 60 + totalCorrectionMinutes;

  // Tính chính xác đến giây để tránh trôi biên thời gian
  const roundedTotalSeconds = Math.round(rawMinutes * 60);
  const dayOffset = Math.floor(roundedTotalSeconds / SECONDS_PER_DAY);
  const secondOfDay = mod(roundedTotalSeconds, SECONDS_PER_DAY);
  const hour = Math.floor(secondOfDay / 3600);
  const minute = Math.floor((secondOfDay % 3600) / 60);
  const second = secondOfDay % 60;
  const normalizedMinutes = secondOfDay / 60;

  return {
    dateValid,
    corrected,
    longitudeCorrectionMinutes,
    equationOfTimeMinutes: eot,
    totalCorrectionMinutes,
    rawMinutes,
    normalizedMinutes,
    dayOffset,
    hour,
    minute,
    second,
    branch: branchFromSolarMinutes(normalizedMinutes),
  };
}

/**
 * Hợp nhất độ lệch ngày Chân Thái Dương Thời và quy tắc giờ Tý muộn (23:00-23:59 tính sang ngày hôm sau).
 */
export function resolveZiweiDayOffset(
  solar: Pick<TrueSolarTimeResult, 'dayOffset' | 'normalizedMinutes' | 'branch'>,
  lateZishi: LateZishiRule = 'next-day',
): number {
  const nextDayRule = lateZishi === 'next-day';
  const isLateZishi = solar.branch === 0 && solar.normalizedMinutes >= 1380;

  if (solar.dayOffset < 0 && isLateZishi) {
    return nextDayRule ? solar.dayOffset + 1 : solar.dayOffset;
  }
  if (solar.dayOffset !== 0) return solar.dayOffset;
  if (isLateZishi) return nextDayRule ? 1 : 0;
  return 0;
}

/**
 * Định dạng Chân Thái Dương Thời thành chuỗi HH:mm:ss (mặc định luôn có giây)
 */
export function formatTrueSolarClock(
  solar: Pick<TrueSolarTimeResult, 'hour' | 'minute' | 'second'>,
  withSeconds = true,
): string {
  const base = `${String(solar.hour).padStart(2, '0')}:${String(solar.minute).padStart(2, '0')}`;
  return withSeconds ? `${base}:${String(solar.second).padStart(2, '0')}` : base;
}

export function formatSignedMinutes(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded}`;
}
