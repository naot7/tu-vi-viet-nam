/**
 * Kiểm thử hồi quy các mốc giờ lịch sử tại Việt Nam (lib/ziwei/dst-vn.ts)
 */
import assert from 'node:assert/strict';
import { getVietnamDSTInfo, isVietnamDST, isVietnamDSTYear, vietnamDSTYears } from '../../lib/ziwei/dst-vn';

let fails = 0;
function ok(name: string, cond: boolean) {
  console.log(`${cond ? '✓' : '✗'} ${name}`);
  if (!cond) fails++;
}

// 1. Giai đoạn 1943 - 1945: UTC+8 toàn quốc
const p1 = getVietnamDSTInfo(1944, 6, 15, false);
ok('1944-06-15 thuộc giờ Đông Dương UTC+8', p1?.periodId === 'vn-ww2-french' && p1.deltaMinutes === -60);

// 2. Giai đoạn tháng 3 - tháng 9/1945: Giờ Tokyo UTC+9 toàn quốc
const p2 = getVietnamDSTInfo(1945, 5, 1, false);
ok('1945-05-01 thuộc giờ Tokyo UTC+9 (delta -120m)', p2?.periodId === 'vn-ww2-japanese' && p2.deltaMinutes === -120);

// 3. Giai đoạn 1960 - 1975: Miền Nam UTC+8, Miền Bắc UTC+7
const south1970 = getVietnamDSTInfo(1970, 5, 1, true);
const north1970 = getVietnamDSTInfo(1970, 5, 1, false);
ok('1970 Miền Nam (Nam vĩ tuyến 17) áp dụng UTC+8 (delta -60m)', south1970?.periodId === 'vn-south-1960-1975' && south1970.deltaMinutes === -60);
ok('1970 Miền Bắc (Bắc vĩ tuyến 17) giữ chuẩn UTC+7 (không áp dụng delta)', north1970 === null);

// 4. Sau ngày 13/06/1975: Toàn quốc thống nhất UTC+7
const post1975 = getVietnamDSTInfo(1976, 1, 1, true);
ok('1976 toàn quốc thống nhất UTC+7 (không còn biến động)', post1975 === null);

// 5. Kiểm tra năm
ok('Năm 1944 là năm có biến động múi giờ', isVietnamDSTYear(1944));
ok('Năm 2026 không có biến động múi giờ', !isVietnamDSTYear(2026));

if (fails) {
  console.error(`\n✗ Kiểm thử giờ lịch sử VN có ${fails} lỗi`);
  process.exit(1);
}
console.log('\n✅ Toàn bộ kiểm thử giờ lịch sử Việt Nam đã PASS thành công');