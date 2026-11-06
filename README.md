<div align="center">

# Tử Vi Đẩu Số · Việt Nam
### Hệ Thống An Sao & Luận Đoán Tử Vi Đẩu Số Chuẩn Hóa Toàn Diện Cho Người Việt

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/Regression_Tests-100%25_Pass-success.svg)](./scripts/regression)

**Tiếng Việt** · [English](./README.en.md)

</div>

---

## 🌟 Giới Thiệu & Triết Lý

**Tử Vi Đẩu Số Việt Nam (`tu-vi-viet-nam`)** là hệ thống an sao và luận giải mệnh lý Tử Vi Đẩu Số mã nguồn mở được phát triển và chuẩn hóa chuyên sâu dành riêng cho người Việt Nam. 

Hệ thống kế thừa tinh hoa học thuật **Chính Tông của Thầy Nghê Hải Hạ (Ni Haixia - 《Thiên Kỷ》)**, kết hợp cùng 3 bộ cổ thư kinh điển: *《Tử Vi Đẩu Số Cốt Tủy Phú》*, *《Tử Vi Đẩu Số Toàn Tập》* và *《Tử Vi Đẩu Số Toàn Thư》*.

> *"Thuật toán là tinh hoa trí tuệ truyền thống được chia sẻ công khai, không nên bị giam cầm phía sau những bức tường đóng kín."*

---

## 🇻🇳 Các Điểm Chuẩn Hóa Đột Phá Cho Việt Nam

Dự án khắc phục toàn diện những hạn chế của các phần mềm an sao ngoại quốc khi áp dụng vào Việt Nam:

1. **Bản đồ Địa lý 34 Tỉnh/Thành phố sau sáp nhập (NQ 202/2025/QH15)**:
   - Tích hợp chuẩn xác dữ liệu tọa độ kinh độ và vĩ độ của 34 tỉnh/thành phố theo **Nghị quyết số 202/2025/QH15 của Quốc hội** (có hiệu lực từ ngày 12/6/2025).
   - Hỗ trợ tra cứu nhanh theo tên 63 tỉnh thành cũ hoặc tên 34 tỉnh thành mới sau sáp nhập.

2. **Quy chuẩn Chân Thái Dương Thời (True Solar Time) theo Kinh tuyến 105°E (UTC+7)**:
   - Sử dụng kinh tuyến gốc chuẩn của Việt Nam ($\lambda_0 = 105^\circ\text{E}$, tương ứng UTC+7 / 420 phút).
   - Tự động bù trừ Phương trình thời gian (Equation of Time - EoT) và chênh lệch kinh độ thực tế tại nơi sinh đến từng giây.

3. **Chuẩn hóa 4 Mốc Đổi Giờ Lịch Sử Việt Nam**:
   - Xử lý tự động và cảnh báo đối với 4 giai đoạn điều chỉnh giờ trong lịch sử Việt Nam:
     - **1943 - 1945**: Giờ Pháp/Đông Dương (UTC+8).
     - **1945**: Nhật đảo chính (UTC+9).
     - **1960 - 1975**: Phân định múi giờ theo Hiệp định Genève và vĩ tuyến 17 (Miền Bắc UTC+7, Miền Nam UTC+8).
     - **1975 đến nay**: Thống nhất toàn quốc theo giờ chuẩn UTC+7.
   - Cung cấp nút tự động chuyển đổi giờ sinh về giờ thực tế chuẩn xác.

4. **Định dạng Thời Gian Chuẩn Việt Nam `DD/MM/YYYY HH:mm:ss`**:
   - Giao diện nhập liệu và hiển thị thời gian tuân thủ nghiêm ngặt thói quen của người Việt (Ngày/Tháng/Năm Giờ:Phút:Giây).
   - Hỗ trợ nhập liệu song hành và chuyển đổi mượt mà giữa Dương lịch và Âm lịch có hiển thị Can Chi.

5. **Việt Hóa 100% Thuật Ngữ & Hiển thị Tên Cung**:
   - Tên cung hiển thị song hành tôn trọng truyền thống: **"Nô Bộc (Giao Hữu)"**.
   - Việt hóa toàn diện 14 chính tinh, 100+ phụ tinh, tứ hóa (Lộc, Quyền, Khoa, Kỵ), ngũ hành nạp âm cục và hệ thống miếu hãm (Miếu, Vượng, Đắc, Bình, Nhàn, Hãm).

6. **Toàn Văn 3 Bộ Cổ Thư Kinh Điển (Chữ Quốc Ngữ kèm Hán-Việt)**:
   - 《Tử Vi Đẩu Số Cốt Tủy Phú》
   - 《Tử Vi Đẩu Số Toàn Tập》
   - 《Tử Vi Đẩu Số Toàn Thư》
   - Tích hợp công cụ tìm kiếm toàn văn câu phú, đối chiếu cổ thư ngay trong ứng dụng (`/library`).

7. **Kho Dữ Liệu Ngày Giờ Sinh Danh Nhân Lịch Sử Việt Nam**:
   - Tích hợp lá số mẫu chuẩn xác của 10 danh nhân lịch sử - văn hóa Việt Nam (Chủ tịch Hồ Chí Minh, Đại tướng Võ Nguyên Giáp, Đại thi hào Nguyễn Du, Hưng Đạo Đại Vương Trần Quốc Tuấn, Nguyễn Trãi, Lê Lợi, Quang Trung...).

8. **Cơ Chế Luận Đoán Mệnh Lý Linh Hoạt (Hybrid Engine)**:
   - **Tự động ngoại tuyến (Offline Rule-based)**: Tự động phân tích lá số, cách cục, tam phương tứ chính ngay lập tức mà không cần kết nối internet hay tài khoản API.
   - **Tùy chọn AI trực tiếp**: Hỗ trợ kết nối với Claude, OpenAI, Gemini hoặc DeepSeek khi người dùng cấu hình API Key.

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu môi trường
- **Node.js**: phiên bản `>= 18.18.0`
- **npm** / **pnpm** / **yarn**

### 1. Di chuyển vào thư mục dự án
```bash
cd /Users/toanvo/Documents/Tuvi/tu-vi-viet-nam
```

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Khởi động môi trường phát triển (Development)
```bash
npm run dev
```
→ Mở trình duyệt và truy cập: **`http://localhost:3000`**

### 4. Kiểm tra kiểu dữ liệu tĩnh (TypeScript Typecheck)
```bash
npm run typecheck
```

### 5. Chạy bộ kiểm thử hồi quy tự động (Unit / Regression Tests)
```bash
npm test
```
*(Kiểm tra thuật toán an sao, kinh độ 34 tỉnh thành, 4 mốc giờ lịch sử VN và giờ sinh danh nhân).*

### 6. Biên dịch và chạy bản hoàn chỉnh (Production Build)
```bash
npm run build
npm run start
```

---

## ⚙️ Cấu Hình Biến Môi Trường (Tùy Chọn)

Hệ thống hoạt động hoàn chỉnh 100% ngoại tuyến mà không cần cấu hình thêm bất kỳ biến môi trường nào. Nếu bạn muốn kích hoạt tính năng **AI Đàm Đạo Trực Tiếp**, sao chép file cấu hình:

```bash
cp .env.example .env.local
```

Sau đó mở `.env.local` và điền API Key mong muốn:
- `ANTHROPIC_API_KEY`: Dùng cho Claude 3.5 Haiku / Sonnet.
- `OPENAI_API_KEY` hoặc `DEEPSEEK_API_KEY`: Dùng cho OpenAI GPT hoặc DeepSeek.

---

## 🏛️ Cấu Trúc Dự Án

```text
tu-vi-viet-nam/
├── app/                      # Next.js 16 App Router (37 static/SSG routes)
│   ├── api/                  # API endpoints (/api/interpret, /api/heming)
│   ├── chart/                # Trang An sao lá số Tử Vi chính
│   ├── heming/               # Trang Hợp bàn đối chiếu 2 lá số
│   ├── library/              # Thư viện toàn văn 3 bộ Cổ thư kinh điển
│   └── knowledge/            # 182 chuyên đề tri thức Tử Vi (14 chính tinh x 13 cung)
├── components/               # Giao diện người dùng (BirthForm, ChartBoard, PalaceCell...)
├── lib/
│   ├── ziwei/                # Engine thuật toán an sao, 34 tỉnh thành, Chân Thái Dương Thời
│   │   ├── cities.ts         # Danh sách 34 tỉnh thành NQ 202/2025/QH15
│   │   ├── dst-vn.ts         # 4 mốc giờ lịch sử Việt Nam
│   │   ├── datetime-vn.ts    # Xử lý định dạng thời gian DD/MM/YYYY HH:mm:ss
│   │   ├── algorithm.ts      # Thuật toán an sao & Boundary Mapping Việt hóa
│   │   └── patterns.ts       # Nhận diện 38+ cách cục Tử Vi
│   └── classics/             # Dữ liệu Quốc ngữ toàn văn Cốt Tủy Phú, Toàn Tập, Toàn Thư
└── scripts/regression/       # Bộ kiểm thử hồi quy tự động
```

---

## 👥 Tác Giả & Lời Tri Ân

### Tác giả phát triển & Việt hóa:
- **Toàn Võ** ([@naot7](https://github.com/naot7)) — Trưởng dự án, chuẩn hóa địa lý 34 tỉnh thành Việt Nam (NQ 202/2025/QH15), tích hợp Chân Thái Dương Thời 105°E, xử lý 4 mốc đổi giờ lịch sử Việt Nam và Việt hóa toàn diện hệ thống.

### Kế thừa học thuật & Tri ân:
- **Thầy Nghê Hải Hạ (Ni Haixia - 倪海厦)**: Đại sư Trung y và Dịch số, tác giả hệ thống 《Thiên Kỷ - Tử Vi Đẩu Số》 chân truyền.
- **Renhuai123 / [ouranic.cn](https://ouranic.cn)**: Tác giả dự án mã nguồn mở nguyên bản đã đóng góp thuật toán ban đầu cho cộng đồng.
- **SylarLong ([iztro](https://github.com/SylarLong/iztro))** & **6tail ([lunar-javascript](https://github.com/6tail/lunar-javascript))**: Các tác giả của các thư viện mã nguồn mở nền tảng về an sao và âm dương lịch.

---

## 📜 Giấy Phép Bản Quyền (License)

Dự án được phân phối dưới giấy phép **[MIT License](./LICENSE)**. Bạn được toàn quyền sử dụng, sửa đổi và triển khai cho mục đích cá nhân lẫn thương mại.
