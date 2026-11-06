/**
 * Cơ sở dữ liệu Lá số mẫu Danh nhân Việt Nam
 * Dựa trên ngày sinh theo chính sử, giờ sinh ước đoán theo cổ thư/nghiên cứu
 */

import 'server-only';

export interface FamousPerson {
  id: string;
  name: string;
  category: 'Lịch sử' | 'Quân sự' | 'Văn hóa' | 'Y học';
  description: string;
  year: number;
  month: number;
  day: number;
  hour: number;                  // Chỉ số địa chi 0-11
  gender: 'male' | 'female';
  notable: string;
}

export const FAMOUS_PERSONS: FamousPerson[] = [
  // ─── Quân sự & Khai quốc ──────────────────────────────────────
  {
    id: 'tran-hung-dao',
    name: 'Trần Hưng Đạo (Trần Quốc Tuấn)',
    category: 'Quân sự',
    description: 'Tiết chế Quốc công, ba lần đại phá quân Nguyên Mông',
    year: 1228, month: 12, day: 10, hour: 6, // Giờ Ngọ
    gender: 'male',
    notable: 'Cách cục Thất Sát Triều Đẩu uy dũng vô song, hóa khí thành Quyền, tài thao lược kiệt xuất muôn đời kính ngưỡng.',
  },
  {
    id: 'le-loi',
    name: 'Lê Lợi (Lê Thái Tổ)',
    category: 'Quân sự',
    description: 'Thủ lĩnh khởi nghĩa Lam Sơn, khai sáng triều Hậu Lê',
    year: 1385, month: 9, day: 10, hour: 0, // Giờ Tý
    gender: 'male',
    notable: 'Cách cục Tử Phủ Đồng Cung gia hội Tả Phụ Hữu Bật, đế nghiệp quật khởi từ gian khó, mười năm nếm mật nằm gai.',
  },
  {
    id: 'quang-trung',
    name: 'Quang Trung (Nguyễn Huệ)',
    category: 'Quân sự',
    description: 'Hoàng đế Tây Sơn, bách chiến bách thắng, đại phá quân Thanh',
    year: 1753, month: 5, day: 5, hour: 6, // Giờ Ngọ
    gender: 'male',
    notable: 'Cách cục Phá Quân độc tọa miếu vượng, tốc chiến tốc thắng, khí phách dời non lấp biển, thiên tài quân sự kiệt xuất.',
  },
  {
    id: 'hai-ba-trung',
    name: 'Hai Bà Trưng (Trưng Trắc)',
    category: 'Lịch sử',
    description: 'Nữ anh hùng dân tộc đầu tiên khởi nghĩa giành độc lập',
    year: 14, month: 8, day: 1, hour: 4, // Giờ Thìn
    gender: 'female',
    notable: 'Cách cục Vũ Khúc Thất Sát uy phong lẫm liệt, nữ trung hào kiệt phất cờ khởi nghĩa xua đuổi giặc ngoại xâm.',
  },

  // ─── Văn hóa & Học thuật ──────────────────────────────────────
  {
    id: 'nguyen-trai',
    name: 'Nguyễn Trãi (Ức Trai)',
    category: 'Văn hóa',
    description: 'Danh nhân văn hóa thế giới, khai quốc công thần nhà Hậu Lê',
    year: 1380, month: 2, day: 15, hour: 2, // Giờ Dần
    gender: 'male',
    notable: 'Cách cục Dương Lương Xương Lộc đệ nhất khoa bảng, tài văn chương thao lược tựa sao Khuê chiếu rọi non sông.',
  },
  {
    id: 'chu-van-an',
    name: 'Chu Văn An (Văn Trinh Công)',
    category: 'Văn hóa',
    description: 'Người thầy của muôn đời, biểu tượng thanh cao khí tiết',
    year: 1292, month: 8, day: 25, hour: 3, // Giờ Mão
    gender: 'male',
    notable: 'Thiên Cơ Thiên Lương miếu vượng thủ Mệnh, đức độ liêm khiết, cương trực thẳng thắn dâng Thất trảm sớ chấn động triều đình.',
  },
  {
    id: 'nguyen-du',
    name: 'Nguyễn Du (Tố Như)',
    category: 'Văn hóa',
    description: 'Đại thi hào dân tộc, tác giả kiệt tác Đoạn Trường Tân Thanh',
    year: 1765, month: 11, day: 23, hour: 1, // Giờ Sửu
    gender: 'male',
    notable: 'Cơ Nguyệt Đồng Lương phối hợp Xương Khúc Đào Hoa, ngòi bút tài hoa trác tuyệt, cảm thấu nỗi đau nhân thế.',
  },
  {
    id: 'ho-xuan-huong',
    name: 'Hồ Xuân Hương',
    category: 'Văn hóa',
    description: 'Bà chúa thơ Nôm, danh nhân văn hóa thế giới',
    year: 1772, month: 3, day: 15, hour: 7, // Giờ Mùi
    gender: 'female',
    notable: 'Tham Lang Hóa Kỵ ngộ Đào Hoa, tài hoa bộc phát, phá cách ngôn từ châm biếm sâu cay, bản lĩnh phi phàm.',
  },
  {
    id: 'phan-boi-chau',
    name: 'Phan Bội Châu (Sào Nam)',
    category: 'Lịch sử',
    description: 'Nhà chí sĩ cách mạng tiền bối đầu thế kỷ XX',
    year: 1867, month: 12, day: 26, hour: 2, // Giờ Dần
    gender: 'male',
    notable: 'Thái Dương Cự Môn dần cung hội chiếu, khẩu tài văn bút hiệu triệu phong trào Đông Du thức tỉnh đồng bào.',
  },

  // ─── Y học ────────────────────────────────────────────────────
  {
    id: 'le-huu-trac',
    name: 'Hải Thượng Lãn Ông (Lê Hữu Trác)',
    category: 'Y học',
    description: 'Đại danh y Việt Nam, tác giả bộ Y Tông Tâm Lĩnh',
    year: 1720, month: 11, day: 12, hour: 5, // Giờ Tỵ
    gender: 'male',
    notable: 'Thiên Lương Hóa Khoa hội tụ y tinh, cả đời tận tụy trị bệnh cứu người, để lại pho sách y dược đồ sộ cho hậu thế.',
  },
];

/** Lọc danh nhân theo danh mục */
export function getFamousByCategory(category: FamousPerson['category']): FamousPerson[] {
  return FAMOUS_PERSONS.filter(p => p.category === category);
}

/** Danh sách tất cả các danh mục */
export const FAMOUS_CATEGORIES: FamousPerson['category'][] = [
  'Quân sự', 'Lịch sử', 'Văn hóa', 'Y học',
];
