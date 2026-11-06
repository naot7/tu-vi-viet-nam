/**
 * Kiểm tra tính nhất quán của Chi giờ sinh trong danh nhân (issue #26)
 * `hour` trong FAMOUS_PERSONS là chỉ số Địa Chi 0-11 (0=Tý ... 11=Hợi).
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const BRANCH_NAMES_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const BRANCH_NAMES_CN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const src = readFileSync(new URL('../../lib/ziwei/famous.ts', import.meta.url), 'utf8');

const rows = [...src.matchAll(/hour:\s*(\d+),?[ \t]*(?:\/\/[ \t]*(.*))?/g)];
assert.ok(rows.length > 0, 'famous.ts không trích xuất được trường hour nào');

let annotated = 0;
for (const [, raw, comment] of rows) {
  const hour = Number(raw);
  assert.ok(
    Number.isInteger(hour) && hour >= 0 && hour <= 11,
    `hour phải là chỉ số chi từ 0-11, thực tế nhận được ${raw}`,
  );
  if (!comment) continue;

  // Kiểm tra tên chi tiếng Việt ("giờ Thìn", "giờ Tý") hoặc tiếng Trung ("辰时")
  const viIndex = BRANCH_NAMES_VI.findIndex(b => comment.toLowerCase().includes(`giờ ${b.toLowerCase()}`));
  const cnIndex = BRANCH_NAMES_CN.findIndex(b => comment.includes(`${b}时`));

  const matchedIndex = viIndex >= 0 ? viIndex : cnIndex;
  if (matchedIndex === -1) continue;

  annotated++;
  assert.equal(
    matchedIndex,
    hour,
    `hour: ${hour} trong chú thích ghi '${BRANCH_NAMES_VI[matchedIndex]}', nhưng chỉ số hour là ${hour} ('${BRANCH_NAMES_VI[hour]}')`,
  );
}

console.log(`✅ Tính nhất quán Chi giờ sinh: ${rows.length} mẫu nhân vật có hour trong 0–11, trong đó ${annotated} mẫu có chú thích khớp tuyệt đối`);