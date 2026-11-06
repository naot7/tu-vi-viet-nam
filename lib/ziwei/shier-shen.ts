/**
 * 将前十二神 / 岁前十二神 —— 按地支起的两组十二神
 *
 * 为什么要有这个文件（2026-08-12）：
 *   主流排盘软件盘上每个宫都带这两个神名，我们盘上一直是空的。
 *
 * ── 一处更正（重要，别再按旧结论走）──────────────────────────────
 *   之前的判断是「岁前十二神主流排盘不排，LNSQX 表没有用处」。表确实用不上，
 *   但结论错了：主流排盘【排】，只是不查表、走公式；
 *   大限 / 流年 / 流月 / 流日 / 流时 / 小限 每层都排，且默认全开。
 *
 * 算法出处（按通行口径整理，经金标准盘核对）：
 *
 *   岁前十二神 —— 公式，不查表
 *       对宫 g = 1..12：神序 = 13 - 起点支 + g，若 > 12 则 -12
 *       即「岁建落在起点支所在宫，顺行十二宫」。与 LNSQX 表逐格等价（对拍脚本里一并验了）。
 *
 *   将前十二神 —— 查 LNJQX 表
 *       对神序 s = 1..12：该神落在宫 LNJQX[s][起点支]
 *       即「神序 s 落在宫 LNJQX[神序][起点支]」。
 *
 *   ★ 两组的起点都是【地支】，且都是【该运限的地支】：
 *     每个运限（大限 / 流年 / 流月 / 流日 / 流时）都按同一个规则：
 *         跟随运限开关开 → 岁前(该层支)，否则 岁前(生年支)
 *         跟随运限开关开 → 将前(该层支)，否则 将前(生年支)
 *     两个开关默认都是开，
 *     即默认跟随运限；本命态（未选运限）无条件用生年支起。
 *
 * 宫位编码：表内用【子起一】(1=子 … 12=亥)。本组自身可独立验：
 *   LNJQX 的将星列 = 三合帝旺（申子辰→子、寅午戌→午、巳酉丑→酉、亥卯未→卯）12/12 全中；
 *   岁驿列与天马表逐格相同、华盖列与华盖表相同、咸池列与咸池表相同。按寅起一则全错。
 *
 * 本文件对外一律用 0-11 地支索引（0=子）。
 *
 * 博士十二神（2026-08-14 金标准盘核对）：从生年禄存起，阳男阴女顺、阴男阳女逆；不跟随运限。
 */

import { LUCUN_TABLE } from './constants';

/** 将前十二神，自将星起顺行。索引 0-11 = 神序。 */
export const JIANG_QIAN_SHEN = [
  'Tướng Tinh', 'Phan An', 'Tuế Dịch', 'Tức Thần', 'Hoa Cái', 'Kiếp Sát',
  'Tai Sát', 'Thiên Sát', 'Chỉ Bối', 'Hàm Trì', 'Nguyệt Sát', 'Vong Thần',
] as const;

/** 岁前十二神，自岁建起顺行。索引 0-11 = 神序。
 * 第 7 位主流排盘盘面写「Tuế Phá」（岁建对宫），不要写成「Đại Hao」——顶栏年支大耗是另一颗星。 */
export const SUI_QIAN_SHEN = [
  'Tuế Kiến', 'Hối Khí', 'Tang Môn', 'Quán Sách', 'Quan Phù', 'Tiểu Hao',
  'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Thiên Đức', 'Điếu Khách', 'Bệnh Phù',
] as const;

/**
 * 博士十二神。金标准盘：宫底第一行所列博士十二神。
 * 从生年禄存起；阳男阴女顺、阴男阳女逆。不跟随运限（流年选中后仍落在生年禄存宫）。
 */
export const BOSHI_SHEN = [
  'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư',
  'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phù',
] as const;

/**
 * 将星落宫（0-11 地支索引）—— 三合局的帝旺位。
 * 申子辰→子、寅午戌→午、巳酉丑→酉、亥卯未→卯，即同三合组共用一个将星宫。
 * anchorBranch 为该运限的地支（本命态传生年支）。
 */
export function jiangXingBranch(anchorBranch: number): number {
  const b = ((anchorBranch % 12) + 12) % 12;
  // 子(0)/辰(4)/申(8) → 子(0)；丑(1)/巳(5)/酉(9) → 酉(9)；
  // 寅(2)/午(6)/戌(10) → 午(6)；卯(3)/未(7)/亥(11) → 卯(3)
  return [0, 9, 6, 3][b % 4];
}

/**
 * 将前十二神：返回长度 12 的数组，下标 = 宫地支（0-11），值 = 神序（0-11，0=将星）。
 * 将星起于三合帝旺位，其后十一神顺行。
 */
export function jiangQianShenByBranch(anchorBranch: number): number[] {
  const start = jiangXingBranch(anchorBranch);
  const out = new Array<number>(12);
  for (let shen = 0; shen < 12; shen++) out[(start + shen) % 12] = shen;
  return out;
}

/**
 * 岁前十二神：返回长度 12 的数组，下标 = 宫地支（0-11），值 = 神序（0-11，0=岁建）。
 * 岁建落在 anchorBranch 宫，其后十一神顺行。
 */
export function suiQianShenByBranch(anchorBranch: number): number[] {
  const a = ((anchorBranch % 12) + 12) % 12;
  const out = new Array<number>(12);
  for (let shen = 0; shen < 12; shen++) out[(a + shen) % 12] = shen;
  return out;
}

/** 便利函数：某一宫的将前十二神名。 */
export function jiangQianShenName(anchorBranch: number, palaceBranch: number): string {
  return JIANG_QIAN_SHEN[jiangQianShenByBranch(anchorBranch)[((palaceBranch % 12) + 12) % 12]];
}

/** 便利函数：某一宫的岁前十二神名。 */
export function suiQianShenName(anchorBranch: number, palaceBranch: number): string {
  return SUI_QIAN_SHEN[suiQianShenByBranch(anchorBranch)[((palaceBranch % 12) + 12) % 12]];
}

/** 阳男阴女顺，阴男阳女逆。年干阴阳与 calcYinYangGender 同一把尺子。 */
export function boshiReverse(yearStem: number, gender: 'male' | 'female'): boolean {
  const yangStem = ((yearStem % 10) + 10) % 10 % 2 === 0;
  return yangStem !== (gender === 'male');
}

/**
 * 博士十二神：返回长度 12 的数组，下标 = 宫地支（0-11），值 = 神序（0-11，0=博士）。
 * 起点 = 生年禄存。
 */
export function boshiShenByStem(yearStem: number, gender: 'male' | 'female'): number[] {
  const start = LUCUN_TABLE[((yearStem % 10) + 10) % 10];
  const reverse = boshiReverse(yearStem, gender);
  const out = new Array<number>(12);
  for (let shen = 0; shen < 12; shen++) {
    const branch = reverse ? (start - shen + 12) % 12 : (start + shen) % 12;
    out[branch] = shen;
  }
  return out;
}

export function boshiShenName(
  yearStem: number, gender: 'male' | 'female', palaceBranch: number,
): string {
  return BOSHI_SHEN[boshiShenByStem(yearStem, gender)[((palaceBranch % 12) + 12) % 12]];
}

/** Bảng tên tiếng Anh (tương thích ngược) */
export const SHIER_SHEN_EN: Record<string, string> = {};

/** 按语言取十二神显示名；未收录则原样返回中文，绝不显示 undefined。 */
export function shierShenLabel(name: string, _lang?: string): string {
  return name;
}
