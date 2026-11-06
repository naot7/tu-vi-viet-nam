/**
 * formToBirthInfo：晚子时换日要按真太阳时判定，与时辰支同一口径。
 *
 * 时辰支按经度校正后的真太阳时算，换日却曾只看钟表「23 点」，两者错位时排盘日差一天：
 *   · 东经 100° 钟表 23:30 → 真太阳时 22:10 亥时，却被挪到次日 → 排成次日亥时；
 *   · 东经 135° 钟表 22:30 → 真太阳时 23:30 晚子时，却留在本日 → 排成本日早子时；
 *   · 东经 80° 钟表 00:30 → 真太阳时前一日 21:50 亥时，却留在本日 → 排成本日亥时。
 * 换日口径与 lib/ziwei/true-solar-time.ts 的 resolveZiweiDayOffset('next-day') 一致。
 */
import assert from 'node:assert/strict';
import { formToBirthInfo } from '../../lib/ziwei/share';
import type { BirthFormState } from '../../components/BirthForm';

function formAt(clockHour: string, clockMinute: string, longitude: number): BirthFormState {
  return {
    name: '',
    year: '2000',
    month: '1',
    day: '31',
    clockHour,
    clockMinute,
    unknownTime: false,
    province: longitude === 105 ? '' : 'Thử nghiệm',
    city: '',
    longitude,
    gender: 'male',
  };
}

const pick = (b: ReturnType<typeof formToBirthInfo>) => ({ year: b.year, month: b.month, day: b.day, hour: b.hour });

// Kiểm tra quy tắc đổi ngày theo Chân Thái Dương Thời (Chuẩn kinh tuyến Việt Nam 105°E, UTC+7)
const cases: Array<[string, string, number, { year: number; month: number; day: number; hour: number }, string]> = [
  ['23', '30', 105, { year: 2000, month: 2, day: 1, hour: 0 }, 'Kinh độ 105° 23:30 Giờ Tý muộn → Ngày hôm sau giờ Tý'],
  ['0', '30', 105, { year: 2000, month: 1, day: 31, hour: 0 }, 'Kinh độ 105° 00:30 Giờ Tý sớm → Ngày hôm nay giờ Tý'],
  ['23', '30', 85, { year: 2000, month: 1, day: 31, hour: 11 }, 'Kinh độ 85° 23:30 (Chân Thái Dương 22:10) → Ngày hôm nay giờ Hợi'],
  ['22', '30', 120, { year: 2000, month: 2, day: 1, hour: 0 }, 'Kinh độ 120° 22:30 (Chân Thái Dương 23:30) → Ngày hôm sau giờ Tý'],
  ['0', '30', 65, { year: 2000, month: 1, day: 30, hour: 11 }, 'Kinh độ 65° 00:30 (Chân Thái Dương hôm trước 21:50) → Ngày hôm trước giờ Hợi'],
  ['23', '50', 115, { year: 2000, month: 2, day: 1, hour: 0 }, 'Kinh độ 115° 23:50 (Chân Thái Dương hôm sau 00:30) → Ngày hôm sau giờ Tý'],
];

for (const [h, mi, lon, expected, label] of cases) {
  assert.deepEqual(pick(formToBirthInfo(formAt(h, mi, lon))), expected, label);
}

const unknown = formToBirthInfo({ ...formAt('23', '30', 100), unknownTime: true });
assert.deepEqual(pick(unknown), { year: 2000, month: 1, day: 31, hour: 0 }, '时辰不详不换日');

console.log('form true-solar day rollover regression passed');
