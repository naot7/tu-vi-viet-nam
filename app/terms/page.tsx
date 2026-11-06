export const metadata = {
  title: 'Điều Khoản Sử Dụng · Tử Vi Đẩu Số',
  description: 'Điều khoản sử dụng và thỏa thuận người dùng của nền tảng Tử Vi Đẩu Số'
};

export default function TermsPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Điều Khoản Sử Dụng</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 5 năm 2026</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Giới thiệu Dịch vụ</h2>
        <p>Nền tảng Tử Vi Đẩu Số cung cấp công cụ an sao và tra cứu mệnh lý dựa trên phương pháp luận của Thầy Nghê Hải Hạ trong giáo trình《Thiên Kỷ》và các bộ cổ thư kinh điển. Toàn bộ nội dung mệnh lý chỉ mang tính chất tham khảo chiêm nghiệm, <strong>không cấu thành bất kỳ lời khuyên y tế, đầu tư tài chính, pháp lý hay quyết định trọng đại mang tính bắt buộc nào</strong>.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Quy chuẩn Người dùng</h2>
        <p>Khi sử dụng nền tảng này, bạn đồng ý:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>Chỉ sử dụng nền tảng cho mục đích cá nhân, học tập, nghiên cứu hợp pháp.</li>
          <li>Không sử dụng nội dung nền tảng để tuyên truyền mê tín dị đoan hoặc thương mại hóa bất hợp pháp.</li>
          <li>Không thực hiện các hành vi gây cản trở hoặc phá hoại sự vận hành bình thường của hệ thống.</li>
          <li>Chịu trách nhiệm về tính chuẩn xác của ngày giờ sinh cung cấp; hệ thống không chịu trách nhiệm về sai lệch phát sinh do nhập sai thông tin.</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Sở hữu Trí tuệ</h2>
        <p style={{ background: 'rgba(184,146,42,0.06)', border: '1px solid rgba(184,146,42,0.2)', padding: 16, borderRadius: 8 }}>
          Toàn bộ thiết kế giao diện, thuật toán an sao, bảng đối chiếu giờ lịch sử Việt Nam, cơ sở dữ liệu 34 tỉnh thành và các bản dịch nghĩa cổ thư trên nền tảng được biên soạn và bảo hộ quyền tác giả. Nghiêm cấm mọi hành vi sao chép trái phép với mục đích thương mại hoặc đảo ngược mã nguồn.
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Miễn trừ Trách nhiệm</h2>
        <p>Thuật số Tử Vi Đẩu Số là di sản văn hóa cổ truyền. Vận mệnh con người chịu tác động của cả ba yếu tố Thiên - Địa - Nhân (Tiên thiên, Môi trường, Ý chí phấn đấu). Người dùng cần giữ thái độ khoa học, lý tính và tự chịu trách nhiệm về mọi quyết định cá nhân trong cuộc sống.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>Chính sách Quyền riêng tư</a> · <a href="/" style={{ color: 'var(--ac)' }}>Trang Chủ</a>
        </p>
      </main>
    </>
  );
}