/**
 * Xuất và dịch chuyển giờ đồng hồ (phục vụ quy đổi giờ mùa hè / múi giờ lịch sử Việt Nam về chuẩn UTC+7).
 */

export interface ClockTime {
  clockHour: string;
  clockMinute: string;
  clockSecond?: string;
}

/**
 * Tính số phút cần dịch chuyển từ giờ thực tế về giờ chuẩn.
 * actualOffsetMin, stdOffsetMin là số phút lệch so với UTC (Đông dương, Tây âm).
 * Ví dụ: Giờ thực tế UTC+8 (480), chuẩn Việt Nam UTC+7 (420) → 420 - 480 = -60 phút.
 */
export function clockToStandardDelta(actualOffsetMin: number, stdOffsetMin: number): number {
  return stdOffsetMin - actualOffsetMin;
}

/**
 * Dịch chuyển giờ đồng hồ đi deltaMin phút (ví dụ: -60 phút hoặc -120 phút).
 * Nếu giờ/phút không hợp lệ hoặc sau khi dịch bị tràn qua ngày khác (nhỏ hơn 0:00 hoặc >= 24:00) thì trả về null.
 */
export function shiftClock(t: ClockTime, deltaMin: number): ClockTime | null {
  if (t.clockHour === '' || t.clockMinute === '') return null;
  const h = Number(t.clockHour);
  const m = Number(t.clockMinute);
  const s = t.clockSecond !== undefined && t.clockSecond !== '' ? Number(t.clockSecond) : 0;

  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  if (!Number.isInteger(s) || s < 0 || s > 59) return null;
  if (!Number.isInteger(deltaMin) || deltaMin === 0) return null;

  const totalMin = h * 60 + m + deltaMin;
  if (totalMin < 0 || totalMin >= 24 * 60) return null;

  return {
    clockHour: String(Math.floor(totalMin / 60)),
    clockMinute: String(totalMin % 60),
    clockSecond: t.clockSecond !== undefined ? String(s) : undefined,
  };
}

/**
 * Định dạng giờ đồng hồ thành chuỗi (HH:mm hoặc HH:mm:ss nếu có giây).
 */
export function formatClock(t: ClockTime): string {
  const h = t.clockHour.padStart(2, '0');
  const m = t.clockMinute.padStart(2, '0');
  if (t.clockSecond !== undefined && t.clockSecond !== '') {
    return `${h}:${m}:${t.clockSecond.padStart(2, '0')}`;
  }
  return `${h}:${m}`;
}
