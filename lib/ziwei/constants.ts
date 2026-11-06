// Thập Thiên Can (Heavenly Stems)
export const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

// Thập Nhị Địa Chi (Earthly Branches)
export const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Thập Nhị Thời Thần tương ứng Địa Chi
export const SHICHEN = [
  { branch: 0, name: 'Giờ Tý', range: '23:00-01:00' },
  { branch: 1, name: 'Giờ Sửu', range: '01:00-03:00' },
  { branch: 2, name: 'Giờ Dần', range: '03:00-05:00' },
  { branch: 3, name: 'Giờ Mão', range: '05:00-07:00' },
  { branch: 4, name: 'Giờ Thìn', range: '07:00-09:00' },
  { branch: 5, name: 'Giờ Tỵ', range: '09:00-11:00' },
  { branch: 6, name: 'Giờ Ngọ', range: '11:00-13:00' },
  { branch: 7, name: 'Giờ Mùi', range: '13:00-15:00' },
  { branch: 8, name: 'Giờ Thân', range: '15:00-17:00' },
  { branch: 9, name: 'Giờ Dậu', range: '17:00-19:00' },
  { branch: 10, name: 'Giờ Tuất', range: '19:00-21:00' },
  { branch: 11, name: 'Giờ Hợi', range: '21:00-23:00' },
];

// Thập Nhị Cung (Cung thứ 8 chuẩn hóa theo quy chuẩn "Nô Bộc (Giao Hữu)")
export const PALACE_NAMES_ORDER = [
  'Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách',
  'Thiên Di', 'Nô Bộc (Giao Hữu)', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'
];

// Nạp Âm Ngũ Hành (30 cặp Can Chi)
export const NAYIN_ELEMENTS = [
  'Kim', 'Hỏa', 'Mộc', 'Thổ', 'Kim', 'Hỏa', 'Thủy', 'Thổ', 'Kim', 'Mộc',
  'Thủy', 'Thổ', 'Hỏa', 'Mộc', 'Thủy', 'Kim', 'Hỏa', 'Mộc', 'Thổ', 'Kim',
  'Hỏa', 'Thủy', 'Thổ', 'Kim', 'Mộc', 'Thủy', 'Thổ', 'Hỏa', 'Mộc', 'Thủy'
];

// Ngũ Hành → Cục số
export const ELEMENT_TO_JU: Record<string, number> = {
  'Thủy': 2, 'Mộc': 3, 'Kim': 4, 'Thổ': 5, 'Hỏa': 6,
  '水': 2, '木': 3, '金': 4, '土': 5, '火': 6,
};

// Tên Ngũ Hành Cục
export const JU_NAMES: Record<number, string> = {
  2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục'
};

// Bảng Tứ Hóa Sinh Niên: Can Năm → [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ]
export const SI_HUA_TABLE: Record<number, [string, string, string, string]> = {
  0: ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],   // Giáp: Liêm Phá Vũ Dương
  1: ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],       // Ất: Cơ Lương Tử Âm
  2: ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],   // Bính: Đồng Cơ Xương Liêm
  3: ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],       // Đinh: Âm Đồng Cơ Cự
  4: ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],       // Mậu: Tham Âm Hữu Cơ
  5: ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],   // Kỷ: Vũ Tham Lương Khúc
  6: ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],   // Canh: Dương Vũ Âm Đồng
  7: ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],     // Tân: Cự Dương Khúc Xương
  8: ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],         // Nhâm: Lương Tử Phù Vũ
  9: ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],       // Quý: Phá Cự Âm Tham
};

// Bảng Thiên Khôi - Thiên Việt (Can Năm → [Thiên Khôi branch, Thiên Việt branch])
export const TIANKUI_TABLE: Record<number, [number, number]> = {
  0: [1, 7],   // Giáp: Khôi Sửu - Việt Mùi
  1: [0, 8],   // Ất: Khôi Tý - Việt Thân
  2: [11, 9],  // Bính: Khôi Hợi - Việt Dậu
  3: [11, 9],  // Đinh: Khôi Hợi - Việt Dậu
  4: [1, 7],   // Mậu: Khôi Sửu - Việt Mùi
  5: [0, 8],   // Kỷ: Khôi Tý - Việt Thân
  6: [1, 7],   // Canh: Khôi Sửu - Việt Mùi
  7: [6, 2],   // Tân: Khôi Ngọ - Việt Dần
  8: [3, 5],   // Nhâm: Khôi Mão - Việt Tỵ
  9: [3, 5],   // Quý: Khôi Mão - Việt Tỵ
};

// Bảng Lộc Tồn (Can Năm → Lộc Tồn branch)
export const LUCUN_TABLE: Record<number, number> = {
  0: 2,   // Giáp: Dần
  1: 3,   // Ất: Mão
  2: 5,   // Bính: Tỵ
  3: 6,   // Đinh: Ngọ
  4: 5,   // Mậu: Tỵ
  5: 6,   // Kỷ: Ngọ
  6: 8,   // Canh: Thân
  7: 9,   // Tân: Dậu
  8: 11,  // Nhâm: Hợi
  9: 0,   // Quý: Tý
};

// Bảng Thiên Mã (Chi Năm → Thiên Mã branch)
// Dần Ngọ Tuất → Thân, Thân Tý Thìn → Dần, Tỵ Dậu Sửu → Hợi, Hợi Mão Mùi → Tỵ
export const TIANMA_TABLE: Record<number, number> = {
  2: 8,   // Dần → Thân
  6: 8,   // Ngọ → Thân
  10: 8,  // Tuất → Thân
  8: 2,   // Thân → Dần
  0: 2,   // Tý → Dần
  4: 2,   // Thìn → Dần
  5: 11,  // Tỵ → Hợi
  9: 11,  // Dậu → Hợi
  1: 11,  // Sửu → Hợi
  11: 5,  // Hợi → Tỵ
  3: 5,   // Mão → Tỵ
  7: 5,   // Mùi → Tỵ
};

// Đặc tính 14 Chính Tinh
export const STAR_DESCRIPTIONS: Record<string, { keywords: string; nature: string; element: string }> = {
  'Tử Vi': { keywords: 'Đế vương · Tôn quý · Độc lập', nature: 'Cát tinh (Đế toạ)', element: 'Thổ' },
  'Thiên Cơ': { keywords: 'Trí tuệ · Biến hóa · Mưu lược', nature: 'Thiện tinh', element: 'Mộc' },
  'Thái Dương': { keywords: 'Quang minh · Quan quý · Hào sảng', nature: 'Cát tinh (Quý tinh)', element: 'Hỏa' },
  'Vũ Khúc': { keywords: 'Tài phú · Cương nghị · Quyết đoán', nature: 'Tài tinh (Cô độc)', element: 'Kim' },
  'Thiên Đồng': { keywords: 'Ôn hòa · Phúc thọ · Tùy duyên', nature: 'Phúc tinh', element: 'Thủy' },
  'Liêm Trinh': { keywords: 'Tài nghệ · Tù tinh · Đào hoa', nature: 'Thứ đào hoa (Hung đới Cát)', element: 'Hỏa' },
  'Thiên Phủ': { keywords: 'Kho tàng · Vững vàng · Điềm đạm', nature: 'Lệnh tinh (Tài khố)', element: 'Thổ' },
  'Thái Âm': { keywords: 'Dịu dàng · Phú quý · Nhu thuận', nature: 'Tài tinh (Phú tinh)', element: 'Thủy' },
  'Tham Lang': { keywords: 'Dục vọng · Đa tài · Đào hoa', nature: 'Chính đào hoa', element: 'Mộc / Thủy' },
  'Cự Môn': { keywords: 'Khẩu tài · Thị phi · Biện luận', nature: 'Ám tinh', element: 'Thủy' },
  'Thiên Tướng': { keywords: 'Phò tá · Trách nhiệm · Ấn thụ', nature: 'Dũng tinh (Ấn tinh)', element: 'Thủy' },
  'Thiên Lương': { keywords: 'Che chở · Y dược · Thọ tinh', nature: 'Ấm tinh', element: 'Thổ' },
  'Thất Sát': { keywords: 'Tướng tinh · Quyết liệt · Uy quyền', nature: 'Dũng tinh (Sát khí)', element: 'Kim' },
  'Phá Quân': { keywords: 'Khai phá · Biến động · Tiên phong', nature: 'Hao tinh', element: 'Thủy' },
};
