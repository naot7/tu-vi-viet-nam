/**
 * 中国大陆夏令时判定 —— 逐字对齐主流排盘口径。
 */

/** 通行口径 XLS_CN，逐字照抄：[年, 起月, 起日, 止月, 止日]，起止日都含。 */
const XLS_CN: readonly (readonly [number, number, number, number, number])[] = [
  [1935, 5, 1, 9, 30], [1936, 5, 1, 9, 30], [1937, 5, 1, 9, 30], [1938, 5, 1, 9, 30],
  [1939, 5, 1, 9, 30], [1940, 5, 1, 9, 30], [1941, 5, 1, 9, 30], [1942, 5, 1, 9, 30],
  [1943, 5, 1, 9, 30], [1944, 5, 1, 9, 30], [1945, 5, 1, 9, 30], [1946, 5, 1, 9, 30],
  [1947, 5, 1, 9, 30], [1948, 5, 1, 9, 30], [1949, 5, 1, 9, 30], [1950, 5, 1, 9, 30],
  [1951, 5, 1, 9, 30], [1952, 3, 1, 10, 31], [1953, 4, 1, 10, 31], [1954, 4, 1, 10, 31],
  [1955, 5, 1, 9, 30], [1956, 5, 1, 9, 30], [1957, 4, 1, 9, 30], [1958, 4, 1, 9, 30],
  [1959, 4, 1, 9, 30], [1960, 6, 1, 9, 30], [1961, 6, 1, 9, 30], [1974, 4, 1, 10, 31],
  [1975, 4, 1, 10, 31], [1979, 7, 1, 9, 30], [1986, 5, 4, 9, 14], [1987, 4, 12, 9, 13],
  [1988, 4, 10, 9, 11], [1989, 4, 16, 9, 17], [1990, 4, 15, 9, 16], [1991, 4, 14, 9, 15],
];

export function isChinaDST(year: number, month: number, day: number): boolean {
  for (const [y, m1, d1, m2, d2] of XLS_CN) {
    if (year === y) {
      if (month > m1 && month < m2) return true;
      if (month === m1) {
        if (day >= d1) return true;
      } else if (month === m2) {
        if (day <= d2) return true;
      }
    }
  }
  return false;
}

export function isChinaDSTYear(year: number): boolean {
  return XLS_CN.some(r => r[0] === year);
}

export function chinaDSTYears(): number[] {
  return XLS_CN.map(r => r[0]);
}

export function chinaDSTRange(year: number): { start: string; end: string } | null {
  const row = XLS_CN.find(r => r[0] === year);
  if (!row) return null;
  const [, m1, d1, m2, d2] = row;
  return {
    start: `${m1} 月 ${d1} 日`,
    end: `${m2} 月 ${d2} 日`,
  };
}
