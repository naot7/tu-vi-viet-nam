/**
 * 主流排盘口径 紫微斗数算法原始数据
 *
 * 来源：按通行口径整理，并经金标准盘核对
 *
 * 用途：作为「主流口径」模式的参考数据，让我们排盘按主流排盘口径
 *
 * 索引约定（**关键**）：
 *   星 ID：1-based，0 占位（数组 [0] 不用）
 *   宫位（地支）：1-based「子起一」——1=子, 2=丑, 3=寅, 4=卯, 5=辰, 6=巳, 7=午, 8=未, 9=申, 10=酉, 11=戌, 12=亥
 *     （★ 2026-06-20 订正：原写「1=寅」是错的；实测 SB 表是子起一，取数 col = branchIdx(子0)+1，见 schoolStarBrightness）
 *   亮度值：1=庙, 2=旺, 3=得, 4=利, 5=平, 6=不, 7=陷；0=默认口径留白（0 不显示）
 *     （★ 2026-06-20 订正：原写「1=平…7=庙」整个方向反了，见 BRIGHTNESS_NUM_TO_CN）
 */

import { SCHOOL_AX } from './school-tables.generated';

// ─── 星 ID → 星名 映射（Chuẩn hóa Tiếng Việt）─────────
export const SCHOOL_STAR_ID_TO_NAME: Record<number, string> = {
  // 14 Chính Tinh
  1: 'Tử Vi', 2: 'Thiên Cơ', 3: 'Thái Dương', 4: 'Vũ Khúc', 5: 'Thiên Đồng', 6: 'Liêm Trinh',
  7: 'Thiên Phủ', 8: 'Thái Âm', 9: 'Tham Lang', 10: 'Cự Môn', 11: 'Thiên Tướng', 12: 'Thiên Lương',
  13: 'Thất Sát', 14: 'Phá Quân',
  // Lục Cát
  15: 'Văn Xương', 16: 'Văn Khúc', 17: 'Tả Phù', 18: 'Hữu Bật', 19: 'Thiên Khôi', 20: 'Thiên Việt',
  // Lộc Mã + Lục Sát
  21: 'Lộc Tồn', 22: 'Thiên Mã', 23: 'Hỏa Tinh', 24: 'Linh Tinh', 25: 'Kình Dương', 26: 'Đà La',
  27: 'Địa Không', 28: 'Địa Kiếp',
  // Tạp Diệu & Thần Sát
  29: 'Thiên Phúc', 30: 'Thiên Quan', 31: 'Thiên Hình', 32: 'Bát Tọa', 33: 'Tam Thai', 34: 'Thiên Tài',
  37: 'Thiên Không', 38: 'Thiên Diêu', 39: 'Thiên Khốc', 40: 'Thiên Hỷ', 41: 'Thiên Hư', 42: 'Thiên Quý', 43: 'Thiên Thọ',
  45: 'Thiên Đức', 48: 'Cô Thần', 51: 'Hồng Loan',
  52: 'Ân Quang', 53: 'Phá Toái', 55: 'Hoa Cái', 56: 'Giải Thần', 57: 'Quả Tú', 58: 'Phượng Các',
  59: 'Phi Liêm', 60: 'Long Trì', 62: 'Đại Hao', 64: 'Thiên Sứ', 65: 'Thiên Thương',
  77: 'Triệt Không', 78: 'Phó Tuần', 79: 'Niên Giải', 80: 'Âm Sát', 81: 'Long Đức', 82: 'Hàm Trì',
};

// ─── Bảng Mệnh Chủ (theo Địa Chi Cung Mệnh 1-12 = Tý đến Hợi) ──────────────────────
export const SCHOOL_MING_ZHU_BY_DIZHI: Record<number, string> = {
  1: 'Tham Lang',   // Tý
  2: 'Cự Môn',     // Sửu
  3: 'Lộc Tồn',    // Dần
  4: 'Văn Khúc',    // Mão
  5: 'Liêm Trinh',  // Thìn
  6: 'Vũ Khúc',    // Tỵ
  7: 'Phá Quân',    // Ngọ
  8: 'Vũ Khúc',    // Mùi
  9: 'Liêm Trinh',  // Thân
  10: 'Văn Khúc',   // Dậu
  11: 'Lộc Tồn',   // Tuất
  12: 'Cự Môn',    // Hợi
};

// ─── Bảng Thân Chủ (theo Địa Chi Năm Sinh 1-12 = Tý đến Hợi) ─────────────────────
export const SCHOOL_SHEN_ZHU_BY_DIZHI: Record<number, string> = {
  1: 'Hỏa Tinh',    // Tý
  2: 'Thiên Tướng', // Sửu
  3: 'Thiên Lương', // Dần
  4: 'Thiên Đồng',  // Mão
  5: 'Văn Xương',   // Thìn
  6: 'Thiên Cơ',    // Tỵ
  7: 'Hỏa Tinh',    // Ngọ
  8: 'Thiên Tướng', // Mùi
  9: 'Thiên Lương', // Thân
  10: 'Thiên Đồng', // Dậu
  11: 'Văn Xương',  // Tuất
  12: 'Thiên Cơ',   // Hợi
};

// ─── 五行局表（命宫天干组 × 命宫地支组 → 五行局数）─────────────────────────
// 五行局表 WXJS (6×7 矩阵)
// 横轴：命宫地支组（1-6，五行属性分组）
// 纵轴：命宫天干组（1-5）
// 输出：2=水二局, 3=木三局, 4=金四局, 5=土五局, 6=火六局
export const SCHOOL_WUXING_JU_TABLE: number[][] = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 2, 6, 3, 5, 4, 6],
  [0, 6, 5, 4, 3, 2, 5],
  [0, 5, 3, 2, 4, 6, 3],
  [0, 3, 4, 6, 2, 5, 4],
  [0, 4, 2, 5, 6, 3, 2],
];

// ─── 十天干四化表（含 5 种主流派变体）────────────────────────────────────────
// 生年四化表 SHB (默认表)
// 索引 1-10 = 甲乙丙丁戊己庚辛壬癸
// 每行 [0, 化禄星ID, 化权星ID, 化科星ID, 化忌星ID]
export const SCHOOL_SIHUA_DEFAULT: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 6, 14, 4, 3],    // 甲: 廉贞6, 破军14, 武曲4, 太阳3
  [0, 2, 12, 1, 8],    // 乙: 天机2, 天梁12, 紫微1, 太阴8
  [0, 5, 2, 15, 6],    // 丙: 天同5, 天机2, 文昌15, 廉贞6
  [0, 8, 5, 2, 10],    // 丁: 太阴8, 天同5, 天机2, 巨门10
  [0, 9, 8, 18, 2],    // 戊: 贪狼9, 太阴8, 右弼18, 天机2
  [0, 4, 9, 12, 16],   // 己: 武曲4, 贪狼9, 天梁12, 文曲16
  [0, 3, 4, 8, 5],     // 庚: 太阳3, 武曲4, 太阴8, 天同5  ← 默认（与 iztro 一致）
  [0, 10, 3, 16, 15],  // 辛: 巨门10, 太阳3, 文曲16, 文昌15
  [0, 12, 1, 17, 4],   // 壬: 天梁12, 紫微1, 左辅17, 武曲4
  [0, 14, 10, 8, 9],   // 癸: 破军14, 巨门10, 太阴8, 贪狼9
];

// ─── 五种庚年四化变体（主流排盘软件设置中可选）─────────────────────────────────────
export const SCHOOL_SIHUA_GENG_VARIANTS = {
  GYWYT: [0, 3, 4, 8, 5],   // 阳武阴同（默认）
  GYWTY: [0, 3, 4, 5, 8],   // 阳武同阴（科忌互换说）
  GYWFT: [0, 3, 4, 7, 5],   // 阳武府同
  GYWFX: [0, 3, 4, 7, 11],  // 阳武府相
  GYWTX: [0, 3, 4, 5, 11],  // 阳武同相
} as const;

// ─── 紫府对宫表（已知紫微宫位查天府宫位）────────────────────────────────────
// 紫府对宫表 [0,5,4,3,2,1,12,11,10,9,8,7,6]
// 紫微在 X 宫 → 天府在 此表[X] 宫
export const SCHOOL_ZIWEI_TIANFU_PAIR: number[] = [
  0, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8, 7, 6,
];

// ─── 14 主星亮度表（4 套主流派系，可切换）────────────────────────────────────
// 索引：表[星 ID][地支 ID] (1-based, [0][*] 和 [*][0] 是占位)
// 仅取前 14 个星（主星）的数据；完整亮度表含 85 颗星
//
// 亮度值：0=陷, 1=平, 2=不, 3=地, 4=利, 5=得, 6=旺, 7=庙

export type BrightnessSchool = 'QS' | 'XD1' | 'ZZ' | 'XD2';

// 全书派（《紫微斗数全书》古籍记载）
export const SCHOOL_BRIGHTNESS_QS: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],     // [0] 占位
  [0, 5, 1, 2, 2, 3, 2, 1, 1, 2, 2, 3, 2],     // 紫微
  [0, 1, 7, 3, 2, 4, 5, 1, 7, 3, 2, 4, 5],     // 天机
  [0, 7, 6, 2, 1, 2, 2, 2, 3, 3, 5, 6, 7],     // 太阳
  [0, 2, 1, 3, 4, 1, 5, 2, 1, 3, 4, 1, 5],     // 武曲
  [0, 2, 6, 4, 5, 5, 1, 7, 6, 2, 5, 5, 1],     // 天同
  [0, 5, 4, 1, 5, 4, 7, 5, 4, 1, 5, 4, 7],     // 廉贞
  [0, 1, 1, 1, 3, 1, 3, 2, 1, 3, 2, 1, 3],     // 天府
  [0, 1, 1, 2, 7, 7, 7, 6, 6, 4, 2, 2, 1],     // 太阴
  [0, 2, 1, 5, 4, 1, 7, 2, 1, 5, 4, 1, 7],     // 贪狼
  [0, 2, 6, 1, 1, 7, 2, 2, 6, 1, 1, 7, 2],     // 巨门
  [0, 1, 1, 1, 7, 3, 3, 1, 3, 1, 7, 3, 3],     // 天相
  [0, 1, 2, 1, 1, 1, 3, 1, 2, 7, 3, 1, 7],     // 天梁
  [0, 2, 1, 1, 2, 1, 5, 2, 1, 1, 2, 1, 5],     // 七杀
  [0, 1, 2, 3, 7, 2, 5, 1, 2, 3, 7, 2, 5],     // 破军
];

// 现代修正 1（默认口径 fallback）
export const SCHOOL_BRIGHTNESS_XD1: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 5, 1, 1, 2, 3, 2, 1, 1, 2, 2, 3, 2],     // 紫微
  [0, 1, 7, 3, 2, 4, 5, 1, 7, 3, 2, 4, 5],     // 天机
  [0, 7, 6, 2, 1, 2, 2, 1, 3, 4, 5, 7, 7],     // 太阳
  [0, 2, 1, 3, 4, 1, 5, 2, 1, 3, 4, 1, 5],     // 武曲
  [0, 2, 6, 4, 1, 5, 1, 7, 6, 2, 5, 5, 1],     // 天同
  [0, 5, 4, 1, 5, 4, 7, 5, 4, 1, 5, 4, 7],     // 廉贞
  [0, 1, 1, 1, 3, 2, 3, 2, 1, 3, 2, 2, 3],     // 天府
  [0, 1, 1, 6, 7, 7, 7, 7, 5, 4, 2, 2, 1],     // 太阴
  [0, 2, 1, 5, 3, 1, 7, 2, 1, 5, 4, 1, 7],     // 贪狼
  [0, 2, 6, 1, 1, 5, 5, 2, 5, 1, 1, 5, 2],     // 巨门
  [0, 1, 1, 1, 7, 5, 3, 3, 3, 1, 7, 3, 3],     // 天相
  [0, 1, 2, 1, 2, 1, 7, 1, 2, 7, 3, 1, 7],     // 天梁
  [0, 2, 1, 1, 2, 3, 5, 2, 1, 1, 2, 1, 5],     // 七杀
  [0, 1, 2, 3, 7, 2, 5, 1, 2, 3, 7, 2, 5],     // 破军
];

// 中州派
export const SCHOOL_BRIGHTNESS_ZZ: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 1, 1, 2, 5, 2, 1, 1, 2, 3, 4, 2],
  [0, 1, 5, 2, 2, 1, 3, 1, 5, 3, 2, 1, 3],
  [0, 5, 5, 2, 1, 2, 2, 1, 3, 4, 4, 5, 5],
  [0, 2, 1, 4, 5, 1, 3, 2, 1, 3, 2, 1, 3],
  [0, 2, 5, 4, 1, 3, 1, 5, 5, 2, 3, 3, 1],
  [0, 3, 2, 1, 4, 2, 5, 3, 1, 1, 3, 2, 5],
  [0, 1, 1, 1, 3, 1, 3, 2, 1, 3, 5, 1, 2],
  [0, 1, 1, 4, 5, 4, 5, 5, 3, 3, 2, 2, 1],
  [0, 2, 1, 3, 4, 1, 5, 2, 1, 3, 3, 1, 5],
  [0, 2, 2, 1, 1, 3, 3, 2, 5, 1, 1, 2, 2],
  [0, 1, 1, 1, 5, 2, 3, 2, 4, 1, 5, 4, 3],
  [0, 1, 2, 1, 1, 2, 5, 1, 2, 5, 4, 2, 5],
  [0, 2, 1, 1, 5, 2, 3, 2, 2, 1, 4, 1, 3],
  [0, 1, 2, 5, 2, 2, 4, 1, 1, 5, 5, 2, 3],
];

// 现代修正 2
export const SCHOOL_BRIGHTNESS_XD2: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 4, 1, 1, 2, 4, 2, 1, 1, 2, 3, 5, 2],
  [0, 1, 5, 2, 2, 2, 3, 1, 5, 2, 2, 2, 3],
  [0, 5, 5, 2, 1, 2, 2, 1, 2, 3, 3, 5, 5],
  [0, 2, 1, 3, 5, 1, 3, 2, 1, 3, 2, 1, 3],
  [0, 2, 5, 3, 1, 2, 1, 5, 5, 2, 3, 3, 1],
  [0, 3, 2, 1, 4, 2, 5, 3, 1, 1, 3, 2, 5],
  [0, 2, 1, 1, 3, 1, 2, 2, 1, 2, 3, 1, 2],
  [0, 1, 1, 5, 5, 5, 5, 5, 5, 2, 2, 1, 1],
  [0, 2, 1, 3, 2, 1, 5, 2, 1, 3, 2, 1, 5],
  [0, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1],
  [0, 1, 1, 1, 5, 2, 3, 2, 3, 1, 5, 5, 3],
  [0, 1, 2, 1, 1, 2, 5, 1, 2, 5, 3, 2, 5],
  [0, 2, 2, 1, 5, 1, 3, 2, 2, 1, 3, 1, 3],
  [0, 1, 1, 5, 2, 2, 3, 1, 1, 5, 5, 2, 3],
];

/** 选择亮度表 */
export function getSchoolBrightnessTable(school: BrightnessSchool = 'XD1'): number[][] {
  switch (school) {
    case 'QS': return SCHOOL_BRIGHTNESS_QS;
    case 'XD1': return SCHOOL_BRIGHTNESS_XD1;
    case 'ZZ': return SCHOOL_BRIGHTNESS_ZZ;
    case 'XD2': return SCHOOL_BRIGHTNESS_XD2;
  }
}

/** 亮度数值 → 中文。
 *  ★ 2026-06-20 重大纠正：此前 `{0陷,1平,2不,3地,4利,5得,6旺,7庙}` 整个方向反了（还把「得」误作「地」），
 *  导致全站亮度与主流排盘口径对不齐。正确口径（金标准盘 19/19 实证）：1=庙…7=陷，0=不显示（留白）。 */
export const BRIGHTNESS_NUM_TO_CN: Record<number, string> = {
  1: 'Miếu', 2: 'Vượng', 3: 'Đắc', 4: 'Lợi', 5: 'Bình', 6: 'Bất', 7: 'Hãm',
};

export const BRIGHTNESS_NUM_TO_CN_5: Record<number, string> = {
  1: 'Miếu', 2: 'Vượng', 3: 'Bình', 4: 'Nhàn', 5: 'Hãm',
};

/** 按流派选「数值→中文」映射：QS/XD1 = 7 档；ZZ/XD2 = 5 档。 */
export const BRIGHTNESS_NUM_TO_CN_BY_SCHOOL: Record<BrightnessSchool, Record<number, string>> = {
  QS: BRIGHTNESS_NUM_TO_CN, XD1: BRIGHTNESS_NUM_TO_CN,
  ZZ: BRIGHTNESS_NUM_TO_CN_5, XD2: BRIGHTNESS_NUM_TO_CN_5,
};

/**
 * 把数字亮度表（按地支 1=寅...12=丑）转成 iztro 兼容的中文亮度数组
 * iztro 亮度数组顺序：[寅,卯,辰,巳,午,未,申,酉,戌,亥,子,丑]
 *
 * 返回 14 主星名 → 12 元素中文数组的 map
 */
export function schoolBrightnessTableToIztroFormat(
  school: BrightnessSchool,
): Record<string, string[]> {
  const table = getSchoolBrightnessTable(school);
  const starIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const result: Record<string, string[]> = {};

  for (const sid of starIds) {
    const row = table[sid];
    if (!row) continue;
    const name = SCHOOL_STAR_ID_TO_NAME[sid];
    if (!name) continue;
    // 表内索引 1-12 (寅起一)；iztro 索引 0-11 (寅起一) — 直接 row.slice(1) 即可
    result[name] = row.slice(1, 13).map((v) => BRIGHTNESS_NUM_TO_CN[v] ?? '');
  }
  return result;
}

// ─── 星曜亮度（全星：主星 + 辅星 + 煞星 + 空劫，凡 SCHOOL_STAR_ID_TO_NAME 收录的）──────────
// ★ 2026-06-20 全套对齐主流排盘口径：之前默认主星用手敲善本表、辅星用 XD1，都对不齐金标准盘。
//   真相 = 主流默认亮度流派 = 全书派（设置页实证），数据就在 SB_QS 表（整理正确），
//   只是当年「数值→中文」映射读反了 + 列索引用错了「寅起一」。纠正后金标准盘复现 19/19。

// 星名 → 星 ID（SCHOOL_STAR_ID_TO_NAME 反查 & Hỗ trợ cả tên tiếng Việt lẫn Hán tự）
export const SCHOOL_NAME_TO_ID: Record<string, number> = {};
for (const k in SCHOOL_STAR_ID_TO_NAME) SCHOOL_NAME_TO_ID[SCHOOL_STAR_ID_TO_NAME[Number(k)]] = Number(k);

const CHINESE_STAR_TO_ID: Record<string, number> = {
  '紫微': 1, '天机': 2, '太阳': 3, '武曲': 4, '天同': 5, '廉贞': 6,
  '天府': 7, '太阴': 8, '贪狼': 9, '巨门': 10, '天相': 11, '天梁': 12,
  '七杀': 13, '破军': 14, '文昌': 15, '文曲': 16, '左辅': 17, '右弼': 18,
  '天魁': 19, '天钺': 20, '禄存': 21, '天马': 22, '火星': 23, '铃星': 24,
  '擎羊': 25, '陀罗': 26, '地空': 27, '地劫': 28, '天福': 29, '天官': 30,
  '天刑': 31, '八座': 32, '三台': 33, '天才': 34, '天空': 37, '天姚': 38,
  '天哭': 39, '天喜': 40, '天虚': 41, '天贵': 42, '天寿': 43, '天德': 45,
  '孤辰': 48, '红鸾': 51, '恩光': 52, '破碎': 53, '华盖': 55, '解神': 56,
  '寡宿': 57, '凤阁': 58, '蜚廉': 59, '龙池': 60, '大耗': 62, '天使': 64,
  '天伤': 65, '截空': 77, '副截': 77, '截路': 77, '副旬': 78, '旬空': 78,
  '空亡': 77, '年解': 79, '阴煞': 80, '龙德': 81, '咸池': 82,
  // Tên Tiếng Việt alias
  'Phó Triệt': 77, 'Triệt Lộ': 77, 'Tuần Không': 78, 'Không Vong': 77,
};
for (const [n, id] of Object.entries(CHINESE_STAR_TO_ID)) SCHOOL_NAME_TO_ID[n] = id;

const SB_BY_SCHOOL: Record<BrightnessSchool, readonly (readonly number[])[]> = {
  QS: SCHOOL_AX.SB_QS, XD1: SCHOOL_AX.SB_XD1, ZZ: SCHOOL_AX.SB_ZZ, XD2: SCHOOL_AX.SB_XD2,
};

/**
 * 查星曜亮度。返回中文亮度字，或 undefined（未收录该星 / 默认口径留白 0）。
 * ★ 默认 school='QS'（全书派）：主流排盘软件「星曜亮度」默认勾选「依据斗数全书」（设置页实证）。
 *   索引：SB 表「子起一」（子=列1…亥=列12），传入 branchIdx 子起 0，故 col = branchIdx + 1。
 *   实证：SB_QS + BRIGHTNESS_NUM_TO_CN + 子起一，金标准盘复现 19/19（10 主星 + 5 辅星 + 4 煞星）。
 * @param branchIdx 星所在宫地支，子起 0（子=0…亥=11）
 */
export function schoolStarBrightness(
  starName: string,
  branchIdx: number,
  school: BrightnessSchool = 'QS',
): string | undefined {
  const id = SCHOOL_NAME_TO_ID[starName];
  if (id == null) return undefined;
  const v = SB_BY_SCHOOL[school]?.[id]?.[branchIdx + 1]; // 子起一
  if (v == null || v === 0) return undefined;            // 0 = 默认口径留白，不显示
  return BRIGHTNESS_NUM_TO_CN_BY_SCHOOL[school][v];       // 按流派选映射：QS/XD1=7档，ZZ/XD2=5档
}

// ─── 小星位置表（24 种辅助星，按生月或生时定位）─────────────────────────────
// 索引：表[index][value0, value1] (大部分按 12 元素，1-12 表示地支)

// 长生十二神 起点表（按五行局 1-6）
export const SCHOOL_CHANGSHENG_QIDIAN: number[][] = [
  [0, 0], [11, 5], [10, 6], [9, 7], [8, 8], [7, 9],
  [6, 10], [5, 11], [4, 12], [3, 1], [2, 2], [1, 3], [12, 4],
];

// ⚠️【2026-05-30 实证修正】此表实为「火铃起点表」(HL = 火铃 HuoLing，非红鸾 HongLuan)。
//   证据:4 年循环(红鸾天喜应 12 年循环);作火铃起点+生时顺数，对照 iztro 火星铃星 26/26 一致。
//   红鸾天喜真表待定位。本常量名不副实、已弃用，排盘以 school-tables.generated.ts 为准。
// 红鸾天喜表（按生年地支 1-12）— ❌ 实为火铃起点
export const SCHOOL_HONGLUAN_TIANXI: number[][] = [
  [0, 0], [3, 11], [4, 11], [2, 4], [10, 11], [3, 11],
  [4, 11], [2, 4], [10, 11], [3, 11], [4, 11], [2, 4], [10, 11],
];

// 孤辰寡宿（按生年地支 1-12）
export const SCHOOL_GUCHEN_GUASU: number[][] = [
  [0, 0], [3, 11], [3, 11], [6, 2], [6, 2], [6, 2],
  [9, 5], [9, 5], [9, 5], [12, 8], [12, 8], [12, 8], [3, 11],
];

// 截空（按生年天干 1-10，4 种排法可选）
export const SCHOOL_JIEKONG_VARIANTS = {
  v1: [0, 9, 7, 5, 3, 1, 10, 8, 6, 4, 2],           // 常规单星法
  v2: [[0, 0], [9, 10], [8, 7], [5, 6], [4, 3], [1, 2], [10, 9], [7, 8], [6, 5], [3, 4], [2, 1]], // 正副双星（默认）
  v3: [0, 9, 7, 5, 3, 11, 10, 8, 6, 4, 12],         // 占验派
} as const;

// 旬空（按生年天干 1-10）
export const SCHOOL_XUNKONG: number[] = [0, 3, 1, 11, 9, 7, 5, 3, 1, 11, 9, 7, 5];

// 天姚（按生月 1-12）
export const SCHOOL_TIANYAO: number[] = [0, 11, 6, 5, 3, 8, 4, 12, 8, 3, 7, 11, 3];

// 天巫（按生月 1-12）
export const SCHOOL_TIANWU: number[] = [0, 6, 9, 3, 12, 6, 9, 3, 12, 6, 9, 3, 12];

// 解神（按生月 1-12）
export const SCHOOL_JIESHEN: number[] = [0, 9, 9, 11, 11, 1, 1, 3, 3, 5, 5, 7, 7];

// ⚠️【2026-05-30 实证修正】此值实为「蜚廉」(FL，按生年支)，非封诰;真封诰是二维 FG 表。
// 封诰（按生时 1-12）— ❌ 实为蜚廉，已弃用，排盘以 school-tables.generated.ts 为准
export const SCHOOL_FENGGAO: number[] = [0, 9, 10, 11, 6, 7, 8, 3, 4, 5, 12, 1, 2];

// 破碎（按生年地支 1-12）
export const SCHOOL_POSUI: number[] = [0, 6, 2, 10, 6, 2, 10, 6, 2, 10, 6, 2, 10];

// 华盖（按生年地支 1-12）
export const SCHOOL_HUAGAI: number[] = [0, 5, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8];

// 咸池（按生年地支 1-12）
export const SCHOOL_XIANCHI: number[] = [0, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7, 4, 1];

// 天厨（按生年天干 1-10）
export const SCHOOL_TIANCHU: number[] = [0, 6, 7, 1, 6, 7, 9, 3, 7, 10, 12];

// ─── 流年小星表 ──────────────────────────────────────────────────────────
// 流年岁前 12 神（按流年地支×位置 12×12）
export const SCHOOL_LIUNIAN_SUIQIAN: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1],
  [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2],
  [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3],
  [0, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4],
  [0, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5],
  [0, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6],
  [0, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7],
  [0, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8],
  [0, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [0, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
];

// 流年将前 12 神（按流年地支×位置 12×12）
export const SCHOOL_LIUNIAN_JIANGQIAN: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7, 4],
  [0, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
  [0, 3, 12, 9, 6, 3, 12, 9, 6, 3, 12, 9, 6],
  [0, 4, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7],
  [0, 5, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8],
  [0, 6, 3, 12, 9, 6, 3, 12, 9, 6, 3, 12, 9],
  [0, 7, 4, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10],
  [0, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11],
  [0, 9, 6, 3, 12, 9, 6, 3, 12, 9, 6, 3, 12],
  [0, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7, 4, 1],
  [0, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5, 2],
  [0, 12, 9, 6, 3, 12, 9, 6, 3, 12, 9, 6, 3],
];

/**
 * 数据完整性自测
 * 在 dev 模式下调用，验证所有表格的维度是否正确
 */
export function validateSchoolData(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  // 命主表 12 项
  if (Object.keys(SCHOOL_MING_ZHU_BY_DIZHI).length !== 12) {
    errors.push(`MING_ZHU expected 12 entries, got ${Object.keys(SCHOOL_MING_ZHU_BY_DIZHI).length}`);
  }
  // 身主表 12 项
  if (Object.keys(SCHOOL_SHEN_ZHU_BY_DIZHI).length !== 12) {
    errors.push(`SHEN_ZHU expected 12 entries, got ${Object.keys(SCHOOL_SHEN_ZHU_BY_DIZHI).length}`);
  }
  // 4 套亮度表 × 15 行（[0]+14 主星）× 13 列（[0]+12 地支）
  for (const [name, tbl] of Object.entries({
    QS: SCHOOL_BRIGHTNESS_QS,
    XD1: SCHOOL_BRIGHTNESS_XD1,
    ZZ: SCHOOL_BRIGHTNESS_ZZ,
    XD2: SCHOOL_BRIGHTNESS_XD2,
  })) {
    if (tbl.length !== 15) errors.push(`亮度表 ${name}: 期望 15 行（含占位），实际 ${tbl.length}`);
    if (tbl[1].length !== 13) errors.push(`亮度表 ${name}: 期望每行 13 列，实际 ${tbl[1].length}`);
  }
  // 四化表 11 行（[0]+10 天干）× 5 列
  if (SCHOOL_SIHUA_DEFAULT.length !== 11) errors.push(`四化表: 期望 11 行，实际 ${SCHOOL_SIHUA_DEFAULT.length}`);

  return { ok: errors.length === 0, errors };
}
