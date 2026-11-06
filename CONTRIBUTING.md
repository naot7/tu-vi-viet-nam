# Hướng Dẫn Đóng Góp (Contributing)

Chào mừng bạn tham gia đóng góp cho dự án **Tử Vi Đẩu Số Việt Nam (`tu-vi-viet-nam`)**! Chúng tôi trân trọng mọi đóng góp, sửa lỗi và cải tiến từ cộng đồng.

## 1. Nguyên Tắc Cốt Lõi

- **Bảo tồn tính nguyên bản của học thuật**: Hệ thống an sao và luận giải tuân thủ chặt chẽ tinh hoa trường phái **Thầy Nghê Hải Hạ 《Thiên Kỷ》** kết hợp 3 bộ cổ thư kinh điển 《Cốt Tủy Phú》, 《Tử Vi Đẩu Số Toàn Tập》, 《Tử Vi Đẩu Số Toàn Thư》.
- **Chuẩn hóa bối cảnh Việt Nam**:
  - Dữ liệu địa lý 34 tỉnh thành sau sáp nhập theo **Nghị quyết 202/2025/QH15** của Quốc hội.
  - Lịch sử múi giờ và 4 mốc đổi giờ lịch sử Việt Nam (1943, 1945, 1960, 1975).
  - Định dạng thời gian chuẩn `DD/MM/YYYY HH:mm:ss` tại múi giờ UTC+7 (105°E).

## 2. Quy Trình Gửi Đóng Góp (Pull Request)

1. Fork dự án về tài khoản GitHub của bạn.
2. Tạo một nhánh mới mô tả tính năng hoặc lỗi cần sửa:
   ```bash
   git checkout -b feature/ten-tinh-nang
   ```
3. Đảm bảo chạy qua toàn bộ các bài kiểm tra tự động trước khi gửi PR:
   ```bash
   npm run typecheck
   npm test
   npm run build
   ```
4. Gửi Pull Request mô tả chi tiết các thay đổi của bạn để được review và merge.

Cảm ơn sự đóng góp quý báu của bạn!
