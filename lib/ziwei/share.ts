import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';
import { calculateTrueSolarTime, resolveZiweiDayOffset, shiftGregorianDate } from './true-solar-time';

/** Kinh độ chuẩn của Thủ đô Hà Nội (làm mốc mặc định) */
export const DEFAULT_LONGITUDE = 105.85;

/**
 * Tính chi của giờ sinh dựa trên Chân Thái Dương Thời theo chuẩn kinh tuyến Việt Nam (105°E)
 * và Phương trình thời gian (EoT).
 */
export function calcTrueSolarBranch(
  clockHour: number,
  clockMinute: number,
  longitude: number,
  clockSecond = 0,
): number {
  const result = calculateTrueSolarTime({
    year: 2000,
    month: 1,
    day: 1,
    clockHour,
    clockMinute,
    clockSecond,
    longitude,
    utcOffsetMinutes: 420,
  });
  return result.branch;
}

/**
 * Chuyển đổi trạng thái biểu mẫu BirthFormState → BirthInfo
 *
 * Quy tắc giờ Tý (Hệ phái chuẩn truyền thống):
 * · 23:00-23:59 = Giờ Tý muộn, tính theo NGÀY HÔM SAU (ngày +1)
 * · 00:00-00:59 = Giờ Tý sớm, tính theo NGÀY HIỆN TẠI
 *
 * Phép đổi ngày được xác định chính xác theo Chân Thái Dương Thời (đã tính độ lệch kinh độ và EoT).
 */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  let y = parseInt(form.year, 10) || 0;
  let m = parseInt(form.month, 10) || 0;
  let d = parseInt(form.day, 10) || 0;
  let hour = 0;

  const clockHour = parseInt(form.clockHour, 10) || 0;
  const clockMinute = parseInt(form.clockMinute, 10) || 0;
  const clockSecond = parseInt(form.clockSecond || '0', 10) || 0;

  const origInput = !form.unknownTime && y > 0 && m > 0 && d > 0 ? {
    year: y,
    month: m,
    day: d,
    clockHour,
    clockMinute,
    clockSecond,
  } : undefined;

  if (!form.unknownTime) {
    const solar = calculateTrueSolarTime({
      year: y > 0 ? y : 2000,
      month: m > 0 ? m : 1,
      day: d > 0 ? d : 1,
      clockHour,
      clockMinute,
      clockSecond,
      longitude: form.longitude,
      utcOffsetMinutes: 420,
    });
    hour = solar.branch;
    const dayOffset = resolveZiweiDayOffset(solar);
    if (dayOffset !== 0 && y > 0 && m > 0 && d > 0) {
      ({ year: y, month: m, day: d } = shiftGregorianDate({ year: y, month: m, day: d }, dayOffset));
    }
  }

  return {
    year: y,
    month: m,
    day: d,
    hour,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
    origInput,
  };
}

/** BirthFormState → URLSearchParams (lưu thông tin trên URL) */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
    if (form.clockSecond && form.clockSecond !== '0') {
      p.set('s', form.clockSecond);
    }
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (form.longitude && form.longitude !== DEFAULT_LONGITUDE) {
    p.set('lo', String(form.longitude));
  }
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState> */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '8',
    clockMinute: params.get('mi') || '0',
    clockSecond: params.get('s') || '0',
    province: params.get('p') || '',
    city: params.get('c') || '',
    longitude: parseFloat(params.get('lo') || String(DEFAULT_LONGITUDE)),
    gender: params.get('g') === 'f' ? 'female' : 'male',
  };
}
