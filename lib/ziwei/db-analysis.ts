/**
 * lib/ziwei/db-analysis —— 开源占位版（论断内容库不在开源范围）
 *
 * 线上完整版包含 14 主星 × 13 宫位语境的详细命理论断（一句话定调 / 核心论断 /
 * 命盘依据 / 经典出处），属于核心内容、不随排盘引擎开源。此文件仅保留 SEO
 * 知识页框架所需的「类型 + 宫位/主题标签」（紫微斗数通用术语，非独有内容），
 * 论断内容库 STAR_DB 置空 —— 因此知识库详情页会生成 0 条静态路由。
 *
 * 排盘内核（安星算法、四化、格局识别、古籍原文）完全开放，
 * 见 lib/ziwei 下的 algorithm.ts / patterns.ts / sihua.ts 等。
 */

export type TopicKey =
  | 'overview' | 'personality' | 'love' | 'career' | 'wealth' | 'health'
  | 'family' | 'children' | 'move' | 'friends' | 'home' | 'spirit' | 'parents';

// iztro zh-CN 宫位名：命宫保留「宫」字，其余无「宫」字，「交友」在 iztro 里叫「仆役」
export const TOPIC_PALACE_NAME: Record<TopicKey, string> = {
  overview:    'Mệnh',
  personality: 'Mệnh',
  love:        'Phu Thê',
  career:      'Quan Lộc',
  wealth:      'Tài Bạch',
  health:      'Tật Ách',
  family:      'Huynh Đệ',
  children:    'Tử Tức',
  move:        'Thiên Di',
  friends:     'Nô Bộc (Giao Hữu)',
  home:        'Điền Trạch',
  spirit:      'Phúc Đức',
  parents:     'Phụ Mẫu',
};

export const TOPIC_LABEL: Record<TopicKey, string> = {
  overview:    'Tổng quan Mệnh cách',
  personality: 'Tính cách Đặc trưng',
  love:        'Tình duyên Hôn nhân',
  career:      'Sự nghiệp Công danh',
  wealth:      'Tài vận Tiền tài',
  health:      'Sức khỏe Thể chất',
  family:      'Huynh đệ Bạn bè',
  children:    'Con cái Duyên phận',
  move:        'Thiên di Xuất ngoại',
  friends:     'Quan hệ Quý nhân',
  home:        'Điền trạch Bất động sản',
  spirit:      'Tinh thần Phúc đức',
  parents:     'Phụ mẫu Trưởng bối',
};

/**
 * 论断内容库（14 主星 × 各宫位语境的详细断语）——核心内容，不在开源范围。
 * 此处置空；知识库 SEO 页因 `exists=false` 生成 0 条静态详情路由，但列表框架仍可运行。
 */
export const STAR_DB: Record<string, unknown> = {};
