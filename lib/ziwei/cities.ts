/**
 * Danh mục Địa giới Hành chính Việt Nam cập nhật theo Nghị quyết số 202/2025/QH15 của Quốc hội.
 * Gồm đúng 34 đơn vị hành chính cấp tỉnh: 06 Thành phố trực thuộc Trung ương và 28 Tỉnh.
 *
 * Mỗi đơn vị hành chính bao gồm tọa độ trung tâm và danh sách các quận, huyện, thị xã,
 * cũng như các tỉnh/thành phố trước thời điểm sáp nhập để phục vụ tra cứu chính xác kinh độ
 * (phục vụ Chân Thái Dương Thời) và xác định vị trí Nam/Bắc vĩ tuyến 17 (phục vụ quy tắc giờ mùa hè 1954–1975).
 */

export interface CityInfo {
  name: string;        // Tên Quận / Huyện / Thị xã / Tỉnh cũ trước sáp nhập
  longitude: number;   // Kinh độ Đông (degrees East)
  latitude?: number;   // Vĩ độ Bắc (degrees North)
  isSouthOf17thParallel?: boolean; // Cờ xác định phía Nam vĩ tuyến 17
}

export const DEFAULT_LONGITUDE = 105.85; // Kinh độ trung tâm Hà Nội (UTC+7)

export interface ProvinceInfo {
  name: string;        // Tên Tỉnh / Thành phố theo NQ 202/2025/QH15
  region: 'north' | 'central' | 'south'; // Miền Bắc, Miền Trung, Miền Nam
  isSouthOf17thParallel: boolean;        // Cờ xác định phía Nam vĩ tuyến 17
  cities: CityInfo[];
}

export const PROVINCES: ProvinceInfo[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // 06 THÀNH PHỐ TRỰC THUỘC TRUNG ƯƠNG
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Thành phố Hà Nội',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'Trung tâm Hà Nội (Hoàn Kiếm)', longitude: 105.85, latitude: 21.03 },
      { name: 'Ba Đình', longitude: 105.83, latitude: 21.03 },
      { name: 'Đống Đa', longitude: 105.82, latitude: 21.01 },
      { name: 'Hai Bà Trưng', longitude: 105.85, latitude: 21.01 },
      { name: 'Cầu Giấy', longitude: 105.79, latitude: 21.03 },
      { name: 'Tây Hồ', longitude: 105.82, latitude: 21.06 },
      { name: 'Thanh Xuân', longitude: 105.81, latitude: 20.99 },
      { name: 'Hoàng Mai', longitude: 105.86, latitude: 20.97 },
      { name: 'Long Biên', longitude: 105.89, latitude: 21.04 },
      { name: 'Hà Đông (Hà Tây cũ)', longitude: 105.77, latitude: 20.97 },
      { name: 'Sơn Tây (Hà Tây cũ)', longitude: 105.50, latitude: 21.14 },
      { name: 'Ba Vì (Hà Tây cũ)', longitude: 105.37, latitude: 21.19 },
      { name: 'Gia Lâm', longitude: 105.95, latitude: 21.03 },
      { name: 'Đông Anh', longitude: 105.84, latitude: 21.14 },
      { name: 'Sóc Sơn', longitude: 105.85, latitude: 21.26 },
      { name: 'Mê Linh', longitude: 105.71, latitude: 21.18 },
    ],
  },
  {
    name: 'Thành phố Hải Phòng',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'Trung tâm Hải Phòng (Hồng Bàng)', longitude: 106.68, latitude: 20.86 },
      { name: 'Ngô Quyền', longitude: 106.70, latitude: 20.85 },
      { name: 'Lê Chân', longitude: 106.67, latitude: 20.84 },
      { name: 'Hải An', longitude: 106.73, latitude: 20.83 },
      { name: 'Kiến An', longitude: 106.63, latitude: 20.80 },
      { name: 'Đồ Sơn', longitude: 106.78, latitude: 20.71 },
      { name: 'Thủy Nguyên', longitude: 106.67, latitude: 20.94 },
      { name: 'Cát Bà (Cát Hải)', longitude: 107.05, latitude: 20.73 },
      { name: 'Khu vực Hải Dương (Hợp nhất)', longitude: 106.33, latitude: 20.94 },
      { name: 'Chí Linh (Hải Dương cũ)', longitude: 106.39, latitude: 21.13 },
      { name: 'Kinh Môn (Hải Dương cũ)', longitude: 106.53, latitude: 20.99 },
    ],
  },
  {
    name: 'Thành phố Huế',
    region: 'central',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'Trung tâm TP. Huế', longitude: 107.59, latitude: 16.46 },
      { name: 'Hương Thủy', longitude: 107.65, latitude: 16.40 },
      { name: 'Hương Trà', longitude: 107.50, latitude: 16.48 },
      { name: 'Phong Điền', longitude: 107.30, latitude: 16.58 },
      { name: 'Phú Vang', longitude: 107.71, latitude: 16.47 },
      { name: 'Phú Lộc (Lăng Cô)', longitude: 107.98, latitude: 16.23 },
      { name: 'A Lưới', longitude: 107.28, latitude: 16.27 },
      { name: 'Nam Đông', longitude: 107.72, latitude: 16.15 },
    ],
  },
  {
    name: 'Thành phố Đà Nẵng',
    region: 'central',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'Trung tâm Đà Nẵng (Hải Châu)', longitude: 108.22, latitude: 16.07 },
      { name: 'Thanh Khê', longitude: 108.19, latitude: 16.06 },
      { name: 'Sơn Trà', longitude: 108.25, latitude: 16.09 },
      { name: 'Ngũ Hành Sơn', longitude: 108.25, latitude: 16.00 },
      { name: 'Liên Chiểu', longitude: 108.15, latitude: 16.08 },
      { name: 'Cẩm Lệ', longitude: 108.19, latitude: 15.99 },
      { name: 'Hòa Vang', longitude: 108.06, latitude: 16.03 },
      { name: 'Hoàng Sa', longitude: 111.50, latitude: 16.50 },
      { name: 'Khu vực Tam Kỳ (Quảng Nam cũ)', longitude: 108.48, latitude: 15.57 },
      { name: 'Hội An (Quảng Nam cũ)', longitude: 108.33, latitude: 15.88 },
      { name: 'Điện Bàn (Quảng Nam cũ)', longitude: 108.25, latitude: 15.90 },
      { name: 'Núi Thành (Chu Lai)', longitude: 108.65, latitude: 15.42 },
    ],
  },
  {
    name: 'Thành phố Hồ Chí Minh',
    region: 'south',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'Trung tâm TP.HCM (Quận 1)', longitude: 106.70, latitude: 10.78 },
      { name: 'Thành phố Thủ Đức', longitude: 106.77, latitude: 10.85 },
      { name: 'Quận 3', longitude: 106.68, latitude: 10.78 },
      { name: 'Quận 5 (Chợ Lớn)', longitude: 106.66, latitude: 10.75 },
      { name: 'Quận 7', longitude: 106.73, latitude: 10.73 },
      { name: 'Tân Bình (Sân bay Tân Sơn Nhất)', longitude: 106.66, latitude: 10.80 },
      { name: 'Bình Thạnh', longitude: 106.70, latitude: 10.80 },
      { name: 'Bình Chánh', longitude: 106.60, latitude: 10.75 },
      { name: 'Củ Chi', longitude: 106.50, latitude: 11.00 },
      { name: 'Hóc Môn', longitude: 106.59, latitude: 10.88 },
      { name: 'Cần Giờ', longitude: 106.86, latitude: 10.41 },
      { name: 'Khu vực Bình Dương (Thủ Dầu Một)', longitude: 106.65, latitude: 10.98 },
      { name: 'Dĩ An (Bình Dương cũ)', longitude: 106.77, latitude: 10.90 },
      { name: 'Thuận An (Bình Dương cũ)', longitude: 106.70, latitude: 10.91 },
      { name: 'Bến Cát (Bình Dương cũ)', longitude: 106.60, latitude: 11.15 },
      { name: 'Khu vực Bà Rịa - Vũng Tàu (TP. Vũng Tàu)', longitude: 107.08, latitude: 10.35 },
      { name: 'TP. Bà Rịa (BR-VT cũ)', longitude: 107.17, latitude: 10.50 },
      { name: 'TX. Phú Mỹ (Cảng Cái Mép)', longitude: 107.05, latitude: 10.58 },
      { name: 'Huyện Côn Đảo', longitude: 106.61, latitude: 8.68 },
    ],
  },
  {
    name: 'Thành phố Cần Thơ',
    region: 'south',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'Trung tâm Cần Thơ (Ninh Kiều)', longitude: 105.78, latitude: 10.03 },
      { name: 'Cái Răng', longitude: 105.75, latitude: 9.99 },
      { name: 'Bình Thủy', longitude: 105.76, latitude: 10.07 },
      { name: 'Ô Môn', longitude: 105.63, latitude: 10.12 },
      { name: 'Thốt Nốt', longitude: 105.53, latitude: 10.28 },
      { name: 'Khu vực Hậu Giang (Vị Thanh)', longitude: 105.47, latitude: 9.78 },
      { name: 'TP. Ngã Bảy (Hậu Giang cũ)', longitude: 105.82, latitude: 9.80 },
      { name: 'Khu vực Sóc Trăng (TP. Sóc Trăng)', longitude: 105.97, latitude: 9.60 },
      { name: 'TX. Vĩnh Châu (Sóc Trăng cũ)', longitude: 106.00, latitude: 9.32 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 28 TỈNH (THEO NGHỊ QUYẾT 202/2025/QH15)
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: 'Tỉnh Cao Bằng',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Cao Bằng', longitude: 106.26, latitude: 22.67 },
      { name: 'Trùng Khánh (Thác Bản Giốc)', longitude: 106.52, latitude: 22.83 },
      { name: 'Hà Quảng (Pác Bó)', longitude: 106.18, latitude: 22.95 },
    ],
  },
  {
    name: 'Tỉnh Lạng Sơn',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Lạng Sơn', longitude: 106.76, latitude: 21.85 },
      { name: 'Đồng Đăng (Cửa khẩu Hữu Nghị)', longitude: 106.72, latitude: 21.94 },
      { name: 'Chi Lăng', longitude: 106.60, latitude: 21.65 },
    ],
  },
  {
    name: 'Tỉnh Quảng Ninh',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Hạ Long', longitude: 107.08, latitude: 20.95 },
      { name: 'TP. Cẩm Phả', longitude: 107.28, latitude: 21.02 },
      { name: 'TP. Uông Bí (Yên Tử)', longitude: 106.78, latitude: 21.03 },
      { name: 'TP. Móng Cái (Trà Cổ)', longitude: 107.97, latitude: 21.53 },
      { name: 'Huyện Vân Đồn', longitude: 107.42, latitude: 21.05 },
    ],
  },
  {
    name: 'Tỉnh Lai Châu',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Lai Châu', longitude: 103.46, latitude: 22.40 },
      { name: 'Mường Tè', longitude: 102.80, latitude: 22.38 },
      { name: 'Phong Thổ', longitude: 103.35, latitude: 22.55 },
    ],
  },
  {
    name: 'Tỉnh Điện Biên',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Điện Biên Phủ', longitude: 103.02, latitude: 21.39 },
      { name: 'TX. Mường Lay', longitude: 103.15, latitude: 22.06 },
      { name: 'Mường Nhé (Cực Tây A Pa Chải)', longitude: 102.15, latitude: 22.40 },
    ],
  },
  {
    name: 'Tỉnh Sơn La',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Sơn La', longitude: 103.91, latitude: 21.33 },
      { name: 'Mộc Châu', longitude: 104.65, latitude: 20.84 },
      { name: 'Mai Sơn', longitude: 104.03, latitude: 21.18 },
    ],
  },
  {
    name: 'Tỉnh Tuyên Quang',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Tuyên Quang', longitude: 105.22, latitude: 21.82 },
      { name: 'Sơn Dương (Tân Trào)', longitude: 105.41, latitude: 21.72 },
      { name: 'Khu vực Hà Giang (Hợp nhất)', longitude: 104.98, latitude: 22.82 },
      { name: 'Đồng Văn (Hà Giang cũ)', longitude: 105.36, latitude: 23.28 },
      { name: 'Mèo Vạc (Hà Giang cũ)', longitude: 105.41, latitude: 23.16 },
    ],
  },
  {
    name: 'Tỉnh Lào Cai',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Lào Cai', longitude: 103.97, latitude: 22.49 },
      { name: 'TX. Sa Pa (Fansipan)', longitude: 103.84, latitude: 22.34 },
      { name: 'Bắc Hà', longitude: 104.28, latitude: 22.54 },
      { name: 'Khu vực Yên Bái (Hợp nhất)', longitude: 104.87, latitude: 21.72 },
      { name: 'TX. Nghĩa Lộ (Mù Cang Chải)', longitude: 104.51, latitude: 21.60 },
    ],
  },
  {
    name: 'Tỉnh Thái Nguyên',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Thái Nguyên', longitude: 105.84, latitude: 21.59 },
      { name: 'TP. Sông Công', longitude: 105.82, latitude: 21.48 },
      { name: 'TP. Phổ Yên', longitude: 105.86, latitude: 21.42 },
      { name: 'Khu vực Bắc Kạn (Hợp nhất)', longitude: 105.83, latitude: 22.15 },
      { name: 'Hồ Ba Bể (Bắc Kạn cũ)', longitude: 105.70, latitude: 22.41 },
    ],
  },
  {
    name: 'Tỉnh Phú Thọ',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Việt Trì (Đền Hùng)', longitude: 105.40, latitude: 21.32 },
      { name: 'TX. Phú Thọ', longitude: 105.22, latitude: 21.40 },
      { name: 'Khu vực Vĩnh Phúc (Vĩnh Yên)', longitude: 105.60, latitude: 21.31 },
      { name: 'TP. Phúc Yên (Vĩnh Phúc cũ)', longitude: 105.72, latitude: 21.32 },
      { name: 'Khu vực Hòa Bình (Hợp nhất)', longitude: 105.34, latitude: 20.82 },
      { name: 'Mai Châu (Hòa Bình cũ)', longitude: 105.08, latitude: 20.66 },
    ],
  },
  {
    name: 'Tỉnh Bắc Ninh',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Bắc Ninh', longitude: 106.07, latitude: 21.19 },
      { name: 'TP. Từ Sơn', longitude: 105.96, latitude: 21.12 },
      { name: 'TX. Thuận Thành', longitude: 106.08, latitude: 21.05 },
      { name: 'Khu vực Bắc Giang (Hợp nhất)', longitude: 106.20, latitude: 21.27 },
      { name: 'TX. Việt Yên (Bắc Giang cũ)', longitude: 106.10, latitude: 21.28 },
    ],
  },
  {
    name: 'Tỉnh Hưng Yên',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Hưng Yên (Phố Hiến)', longitude: 106.05, latitude: 20.65 },
      { name: 'TX. Mỹ Hào', longitude: 106.09, latitude: 20.94 },
      { name: 'Văn Giang (Ecopark)', longitude: 105.95, latitude: 20.95 },
      { name: 'Khu vực Thái Bình (Hợp nhất)', longitude: 106.34, latitude: 20.45 },
      { name: 'Tiền Hải (Thái Bình cũ)', longitude: 106.58, latitude: 20.40 },
    ],
  },
  {
    name: 'Tỉnh Ninh Bình',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Ninh Bình (Tràng An - Cố đô)', longitude: 105.98, latitude: 20.25 },
      { name: 'TP. Tam Điệp', longitude: 105.92, latitude: 20.15 },
      { name: 'Khu vực Nam Định (Hợp nhất)', longitude: 106.17, latitude: 20.42 },
      { name: 'Khu vực Hà Nam (Phủ Lý)', longitude: 105.91, latitude: 20.54 },
      { name: 'TX. Duy Tiên (Hà Nam cũ)', longitude: 105.93, latitude: 20.63 },
    ],
  },
  {
    name: 'Tỉnh Thanh Hóa',
    region: 'north',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Thanh Hóa', longitude: 105.78, latitude: 19.80 },
      { name: 'TP. Sầm Sơn', longitude: 105.90, latitude: 19.74 },
      { name: 'TX. Bỉm Sơn', longitude: 105.91, latitude: 20.08 },
      { name: 'TX. Nghi Sơn', longitude: 105.78, latitude: 19.38 },
      { name: 'Ngọc Lặc', longitude: 105.38, latitude: 20.06 },
    ],
  },
  {
    name: 'Tỉnh Nghệ An',
    region: 'central',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Vinh', longitude: 105.68, latitude: 18.67 },
      { name: 'TX. Cửa Lò', longitude: 105.71, latitude: 18.80 },
      { name: 'TX. Thái Hòa', longitude: 105.43, latitude: 19.32 },
      { name: 'TX. Hoàng Mai', longitude: 105.71, latitude: 19.25 },
      { name: 'Nam Đàn (Quê Bác)', longitude: 105.51, latitude: 18.70 },
      { name: 'Tương Dương', longitude: 104.45, latitude: 19.28 },
    ],
  },
  {
    name: 'Tỉnh Hà Tĩnh',
    region: 'central',
    isSouthOf17thParallel: false,
    cities: [
      { name: 'TP. Hà Tĩnh', longitude: 105.90, latitude: 18.34 },
      { name: 'TX. Hồng Lĩnh', longitude: 105.70, latitude: 18.53 },
      { name: 'TX. Kỳ Anh (Vũng Áng)', longitude: 106.29, latitude: 18.07 },
      { name: 'Hương Sơn', longitude: 105.28, latitude: 18.47 },
    ],
  },
  {
    name: 'Tỉnh Quảng Trị',
    region: 'central',
    isSouthOf17thParallel: false, // Phía Bắc vĩ tuyến 17 (Quảng Bình cũ và Vĩnh Linh), phía Nam có cờ riêng
    cities: [
      { name: 'Khu vực Đồng Hới (Quảng Bình cũ)', longitude: 106.62, latitude: 17.47, isSouthOf17thParallel: false },
      { name: 'TX. Ba Đồn (Quảng Bình cũ)', longitude: 106.42, latitude: 17.75, isSouthOf17thParallel: false },
      { name: 'TP. Đông Hà (Nam vĩ tuyến 17)', longitude: 107.09, latitude: 16.82, isSouthOf17thParallel: true },
      { name: 'TX. Quảng Trị (Nam vĩ tuyến 17)', longitude: 107.19, latitude: 16.75, isSouthOf17thParallel: true },
      { name: 'Vĩnh Linh (Bắc sông Bến Hải)', longitude: 107.03, latitude: 17.06, isSouthOf17thParallel: false },
    ],
  },
  {
    name: 'Tỉnh Quảng Ngãi',
    region: 'central',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Quảng Ngãi', longitude: 108.80, latitude: 15.12 },
      { name: 'TX. Đức Phổ (Sa Huỳnh)', longitude: 109.00, latitude: 14.80 },
      { name: 'Bình Sơn (Dung Quất)', longitude: 108.75, latitude: 15.28 },
      { name: 'Khu vực Kon Tum (Hợp nhất)', longitude: 108.00, latitude: 14.35 },
      { name: 'Măng Đen (Kon Tum cũ)', longitude: 108.30, latitude: 14.60 },
      { name: 'Đảo Lý Sơn', longitude: 109.13, latitude: 15.38 },
    ],
  },
  {
    name: 'Tỉnh Gia Lai',
    region: 'central',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Pleiku', longitude: 108.00, latitude: 13.98 },
      { name: 'TX. An Khê', longitude: 108.65, latitude: 13.96 },
      { name: 'TX. Ayun Pa', longitude: 108.45, latitude: 13.38 },
      { name: 'Khu vực Bình Định (TP. Quy Nhơn)', longitude: 109.22, latitude: 13.78 },
      { name: 'TX. An Nhơn (Bình Định cũ)', longitude: 109.11, latitude: 13.88 },
      { name: 'TX. Hoài Nhơn (Bình Định cũ)', longitude: 109.04, latitude: 14.48 },
    ],
  },
  {
    name: 'Tỉnh Đắk Lắk',
    region: 'central',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Buôn Ma Thuột', longitude: 108.04, latitude: 12.67 },
      { name: 'TX. Buôn Hồ', longitude: 108.26, latitude: 12.92 },
      { name: 'Khu vực Phú Yên (TP. Tuy Hòa)', longitude: 109.31, latitude: 13.09 },
      { name: 'TX. Sông Cầu (Phú Yên cũ)', longitude: 109.22, latitude: 13.45 },
      { name: 'TX. Đông Hòa (Mũi Điện - Cực Đông)', longitude: 109.46, latitude: 12.88 },
    ],
  },
  {
    name: 'Tỉnh Khánh Hòa',
    region: 'central',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Nha Trang', longitude: 109.19, latitude: 12.24 },
      { name: 'TP. Cam Ranh', longitude: 109.13, latitude: 11.91 },
      { name: 'TX. Ninh Hòa', longitude: 109.13, latitude: 12.49 },
      { name: 'Vạn Ninh (Bắc Vân Phong)', longitude: 109.24, latitude: 12.69 },
      { name: 'Khu vực Ninh Thuận (Phan Rang)', longitude: 108.99, latitude: 11.57 },
      { name: 'Trường Sa', longitude: 112.50, latitude: 9.00 },
    ],
  },
  {
    name: 'Tỉnh Lâm Đồng',
    region: 'central',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Đà Lạt', longitude: 108.44, latitude: 11.94 },
      { name: 'TP. Bảo Lộc', longitude: 107.81, latitude: 11.55 },
      { name: 'Đức Trọng (Sân bay Liên Khương)', longitude: 108.38, latitude: 11.73 },
      { name: 'Khu vực Đắk Nông (Gia Nghĩa)', longitude: 107.69, latitude: 12.00 },
      { name: 'Đắk Mil (Đắk Nông cũ)', longitude: 107.62, latitude: 12.45 },
      { name: 'Khu vực Bình Thuận (TP. Phan Thiết)', longitude: 108.10, latitude: 10.93 },
      { name: 'TX. La Gi (Bình Thuận cũ)', longitude: 107.77, latitude: 10.66 },
      { name: 'Mũi Né (Bình Thuận cũ)', longitude: 108.28, latitude: 10.93 },
    ],
  },
  {
    name: 'Tỉnh Đồng Nai',
    region: 'south',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Biên Hòa', longitude: 106.83, latitude: 10.95 },
      { name: 'TP. Long Khánh', longitude: 107.24, latitude: 10.93 },
      { name: 'Long Thành (Sân bay QT Long Thành)', longitude: 106.96, latitude: 10.78 },
      { name: 'Khu vực Bình Phước (Đồng Xoài)', longitude: 106.90, latitude: 11.53 },
      { name: 'TX. Bình Long (Bình Phước cũ)', longitude: 106.60, latitude: 11.65 },
      { name: 'TX. Chơn Thành (Bình Phước cũ)', longitude: 106.67, latitude: 11.45 },
    ],
  },
  {
    name: 'Tỉnh Tây Ninh',
    region: 'south',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Tây Ninh', longitude: 106.10, latitude: 11.31 },
      { name: 'TX. Trảng Bàng', longitude: 106.37, latitude: 11.03 },
      { name: 'TX. Hòa Thành', longitude: 106.13, latitude: 11.26 },
      { name: 'Khu vực Long An (TP. Tân An)', longitude: 106.41, latitude: 10.53 },
      { name: 'TX. Kiến Tường (Long An cũ)', longitude: 105.93, latitude: 10.78 },
      { name: 'Bến Lức (Long An cũ)', longitude: 106.48, latitude: 10.64 },
      { name: 'Đức Hòa (Long An cũ)', longitude: 106.45, latitude: 10.88 },
    ],
  },
  {
    name: 'Tỉnh Đồng Tháp',
    region: 'south',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Cao Lãnh', longitude: 105.63, latitude: 10.46 },
      { name: 'TP. Sa Đéc', longitude: 105.76, latitude: 10.30 },
      { name: 'TP. Hồng Ngự', longitude: 105.28, latitude: 10.82 },
      { name: 'Khu vực Tiền Giang (Mỹ Tho)', longitude: 106.36, latitude: 10.36 },
      { name: 'TX. Gò Công (Tiền Giang cũ)', longitude: 106.67, latitude: 10.36 },
      { name: 'TX. Cai Lậy (Tiền Giang cũ)', longitude: 106.12, latitude: 10.41 },
    ],
  },
  {
    name: 'Tỉnh Vĩnh Long',
    region: 'south',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Vĩnh Long', longitude: 105.97, latitude: 10.25 },
      { name: 'TX. Bình Minh', longitude: 105.78, latitude: 10.03 },
      { name: 'Khu vực Bến Tre (TP. Bến Tre)', longitude: 106.38, latitude: 10.24 },
      { name: 'Ba Tri (Bến Tre cũ)', longitude: 106.60, latitude: 10.05 },
      { name: 'Chợ Lách (Bến Tre cũ)', longitude: 106.13, latitude: 10.25 },
      { name: 'Khu vực Trà Vinh (TP. Trà Vinh)', longitude: 106.34, latitude: 9.94 },
      { name: 'TX. Duyên Hải (Trà Vinh cũ)', longitude: 106.50, latitude: 9.65 },
    ],
  },
  {
    name: 'Tỉnh An Giang',
    region: 'south',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Long Xuyên', longitude: 105.43, latitude: 10.37 },
      { name: 'TP. Châu Đốc', longitude: 105.12, latitude: 10.70 },
      { name: 'TX. Tân Châu', longitude: 105.24, latitude: 10.80 },
      { name: 'TX. Tịnh Biên', longitude: 104.94, latitude: 10.60 },
      { name: 'Khu vực Kiên Giang (Rạch Giá)', longitude: 105.08, latitude: 10.01 },
      { name: 'TP. Phú Quốc (Kiên Giang cũ)', longitude: 103.96, latitude: 10.23 },
      { name: 'TP. Hà Tiên (Kiên Giang cũ)', longitude: 104.48, latitude: 10.38 },
    ],
  },
  {
    name: 'Tỉnh Cà Mau',
    region: 'south',
    isSouthOf17thParallel: true,
    cities: [
      { name: 'TP. Cà Mau', longitude: 105.15, latitude: 9.18 },
      { name: 'Năm Căn', longitude: 104.98, latitude: 8.75 },
      { name: 'Mũi Cà Mau (Đất Mũi - Cực Nam)', longitude: 104.72, latitude: 8.61 },
      { name: 'Khu vực Bạc Liêu (TP. Bạc Liêu)', longitude: 105.72, latitude: 9.29 },
      { name: 'TX. Giá Rai (Bạc Liêu cũ)', longitude: 105.45, latitude: 9.24 },
    ],
  },
];
