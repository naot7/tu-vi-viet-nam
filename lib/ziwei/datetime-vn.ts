/**
 * Bộ hàm tiện ích xử lý định dạng Thời gian & Ngày tháng chuẩn Việt Nam (DD/MM/YYYY HH:mm:ss)
 * và Múi giờ Việt Nam (UTC+7 - Asia/Ho_Chi_Minh).
 */

const PAD = (n: number, len = 2): string => String(Math.floor(n)).padStart(len, '0');

/**
 * Định dạng ngày Dương lịch thành chuỗi chuẩn DD/MM/YYYY
 */
export function formatDateVN(year: number, month: number, day: number): string {
  if (!year || !month || !day) return '';
  return `${PAD(day)}/${PAD(month)}/${PAD(year, 4)}`;
}

/**
 * Định dạng giờ đồng hồ thành chuỗi chuẩn HH:mm:ss
 */
export function formatTimeVN(hour: number, minute: number, second = 0): string {
  return `${PAD(hour)}:${PAD(minute)}:${PAD(second)}`;
}

/**
 * Định dạng đối tượng Date hoặc timestamp thành DD/MM/YYYY HH:mm:ss theo múi giờ Việt Nam (UTC+7)
 */
export function formatDateTimeVN(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  // Chuyển sang múi giờ Asia/Ho_Chi_Minh (UTC+7)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  // en-GB format is DD/MM/YYYY, HH:mm:ss
  const formatted = formatter.format(d);
  return formatted.replace(',', '');
}

/**
 * Phân tích chuỗi ngày giờ DD/MM/YYYY HH:mm:ss hoặc DD/MM/YYYY
 */
export function parseDateTimeVN(str: string): {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second: number;
} | null {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  const hour = match[4] ? parseInt(match[4], 10) : 0;
  const minute = match[5] ? parseInt(match[5], 10) : 0;
  const second = match[6] ? parseInt(match[6], 10) : 0;

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) return null;

  // Kiểm tra tính hợp lệ của ngày trong tháng
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    return null;
  }

  return { day, month, year, hour, minute, second };
}

/**
 * Lấy thời gian hiện tại theo chuẩn múi giờ Việt Nam (UTC+7)
 */
export function getNowVN(): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(now);

  const getPart = (type: string) => {
    const val = parts.find((p) => p.type === type)?.value;
    return val ? parseInt(val, 10) : 0;
  };

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    hour: getPart('hour'),
    minute: getPart('minute'),
    second: getPart('second'),
  };
}

