export const metadata = { 
  title: 'Chính Sách Quyền Riêng Tư · Tử Vi Đẩu Số', 
  description: 'Chính sách bảo vệ quyền riêng tư và dữ liệu người dùng trên nền tảng Tử Vi Đẩu Số' 
};

export default function PrivacyPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Trang Chủ</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', fontWeight: 600 }}>Tử Vi Đẩu Số</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Chính Sách Quyền Riêng Tư</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 5 năm 2026</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Thu thập Thông tin</h2>
        <p>Để an lập lá số Tử Vi Đẩu Số chuẩn xác, hệ thống chỉ thu thập các thông số cần thiết phục vụ tính toán:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>Họ và tên (không bắt buộc)</li>
          <li>Ngày, tháng, năm sinh (Dương lịch hoặc Âm lịch)</li>
          <li>Giờ, phút, giây sinh</li>
          <li>Giới tính sinh học</li>
          <li>Tỉnh/Thành phố nơi sinh (để lấy kinh độ tính Chân Thái Dương Thời)</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Lưu trữ và Bảo mật Cục bộ</h2>
        <p>Thuật toán an sao Tử Vi Đẩu Số chạy hoàn toàn phía client (trong trình duyệt của bạn). Dữ liệu lịch sử an sao được lưu trữ trên bộ nhớ cục bộ (localStorage) của thiết bị cá nhân bạn, không bị chia sẻ trái phép.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Cookies & Bộ nhớ Cục bộ</h2>
        <p>Nền tảng sử dụng localStorage để ghi nhớ chế độ giao diện sáng/tối và danh sách các lá số bạn đã từng an sao để thuận tiện tra cứu lại mà không cần nhập lại ngày giờ sinh.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Quyền của Người dùng</h2>
        <p>Bạn có toàn quyền xóa lịch sử an sao bất kỳ lúc nào bằng cách xóa lịch sử duyệt web hoặc nhấn nút xóa lịch sử trong ứng dụng.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>Điều khoản Sử dụng</a> · <a href="/" style={{ color: 'var(--ac)' }}>Trang Chủ</a>
        </p>
      </main>
    </>
  );
}