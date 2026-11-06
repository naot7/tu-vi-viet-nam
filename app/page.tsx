'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AnnouncementModal from '@/components/AnnouncementModal';

// ─── Hiệu ứng FadeIn cuộn trang ────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── Nút chuyển đổi Giao diện Tối / Sáng ──────────────────
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? 'Tối' : 'Sáng'}
      </span>
    </motion.button>
  );
}

// ─── 14 Chính Tinh ─────────────────────────────────────────
const STARS = [
  { name: 'Tử Vi' }, { name: 'Thiên Cơ' }, { name: 'Thái Dương' }, { name: 'Vũ Khúc' },
  { name: 'Thiên Đồng' }, { name: 'Liêm Trinh' }, { name: 'Thiên Phủ' }, { name: 'Thái Âm' },
  { name: 'Tham Lang' }, { name: 'Cự Môn' }, { name: 'Thiên Tướng' }, { name: 'Thiên Lương' },
  { name: 'Thất Sát' }, { name: 'Phá Quân' },
];

// ─── Các tính năng nổi bật ──────────────────────────────────
const FEATURES = [
  {
    tag: 'Hệ Thống An Sao',
    title: 'Nghê Hải Hạ\nChính Tông',
    subtitle: 'Chuẩn mực kinh điển, kế thừa trực tiếp phương pháp Thầy Nghê Hải Hạ',
    points: [
      'Khởi bàn bằng Nạp Âm Ngũ Hành Cục, không dùng thuật toán giản lược',
      'Định Mệnh nghịch đếm giờ sinh, Thân thuận đếm giờ sinh, đối chiếu quy chuẩn',
      '14 chính tinh và Tứ Hóa phi tinh suy diễn đúng nguyên pháp, logic minh bạch',
    ],
  },
  {
    tag: 'Hiển Thị Mệnh Bàn',
    title: 'Trọn Vẹn 14 Chính Tinh\n& Tứ Hóa Phi Tinh',
    subtitle: 'Bố cục tường minh, nắm bắt ngay trục cốt lõi của lá số',
    points: [
      '14 chính tinh nhập cung chuẩn xác, hiển thị rõ mối quan hệ tương hỗ giữa các sao',
      'Cát tinh và Sát tinh hội tụ đầy đủ trên một màn hình, tránh sót thông tin trọng yếu',
      'Phân cấp độ sáng Miếu Vượng Lợi Hãm rõ nét, trực quan đánh giá cường nhược',
      'Chạm vào bất kỳ sao nào để xem lời luận giải chuyên sâu của Thầy Nghê Hải Hạ',
    ],
  },
  {
    tag: 'AI Luận Giải',
    title: 'Luận Đoán Chuyên Sâu\nVượt Xa Tính Toán',
    subtitle: 'Tri thức Thầy Nghê Hải Hạ & Cổ thư kết hợp cùng Trí tuệ Nhân tạo',
    points: [
      'Định tính cách cục: Phân tích toàn diện từ chính tinh Mệnh cung kết hợp tam phương tứ chính',
      'Luận đoán 6 phương diện: Sự nghiệp, tình duyên hôn nhân, tài vận, sức khỏe, gia đạo, con cái',
      'Theo dõi Đại Hạn & Lưu Niên: Trọng tâm vận trình 10 năm và lưu niên từng năm cụ thể',
      'Hỏi đáp tự do: Trực tiếp đặt câu hỏi cụ thể theo mệnh bàn như "Năm nay hợp đổi nghề không?"',
    ],
  },
  {
    tag: 'Nhận Diện Cách Cục',
    title: 'Tự Động Nhận Diện\n38+ Cách Cục Tử Vi',
    subtitle: 'Phát hiện những cách cục đặc biệt định hình nên vận mệnh',
    points: [
      'Tự động phát hiện 38+ cách cục kinh điển: Tử Phủ Đồng Cung, Sát Phá Lang, Cơ Nguyệt Đồng Lương, v.v.',
      'Phát hiện cách cục đặc biệt như Tả Hữu Giáp Mệnh, Nhật Nguyệt Tịnh Minh kèm lời bình chuẩn xác',
      'Đánh dấu tự động các trạng thái Tứ Hóa nhập Mệnh hoặc Thiên Di, nhắc nhở đề tài cuộc đời',
      'Phân tầng Cát Cách / Hung Cách giúp bạn có cái nhìn quân bình về thế mạnh và thử thách',
    ],
  },
];

// ─── 4 Phân hệ nghiên cứu ─────────────────────────────────
const SECTIONS = [
  {
    key: 'ziwei',
    name: 'Tử Vi',
    en: 'Zi Wei',
    desc: '14 Chính tinh · 12 Cung vị · AI Luận giải',
    status: 'ready' as const,
    when: 'Hiện tại',
    icon: '◉',
    note: '',
  },
  {
    key: 'tianji',
    name: 'Thiên Kỷ',
    en: 'Tian Ji',
    desc: 'Tử Vi · Chu Dịch · Kỳ Môn Độn Giáp',
    status: 'soon' as const,
    when: 'Sắp ra mắt',
    icon: '⊙',
    note: '',
  },
  {
    key: 'diji',
    name: 'Địa Kỷ',
    en: 'Di Ji',
    desc: 'Khảo sát địa lý · Sơn xuyên hình thế',
    status: 'soon' as const,
    when: 'Sắp ra mắt',
    icon: '⊞',
    note: 'Di cảo',
  },
  {
    key: 'renji',
    name: 'Nhân Kỷ',
    en: 'Ren Ji',
    desc: 'Nội Kinh · Thương Hàn · Kim Quỹ · Châm Cứu',
    status: 'soon' as const,
    when: 'Sắp ra mắt',
    icon: '⊕',
    note: '',
  },
];

// ─── Giáo lý cốt lõi Thầy Nghê Hải Hạ ─────────────────────
const NI_TEACHINGS = [
  {
    title: 'Mệnh Cung Vi Bản, Tam Phương Vi Dụng',
    body: 'Thầy Nghê luôn căn dặn: Luận mệnh trước hết phải định Mệnh cung. Chính tinh Mệnh cung quyết định cốt cách và tính tình căn bản; tam phương (Tài Bạch, Quan Lộc, Thiên Di) quyết định vũ đài thi triển tài năng. Bốn cung liên hoàn mới tạo nên bức tranh nhân sinh trọn vẹn.',
  },
  {
    title: 'Đối Cung Mượn Sao, Tuyệt Đối Chớ Quên',
    body: 'Nét tinh tế của Thầy Nghê là rất chú trọng "Đối cung". Cung vị nào vô chính diệu thì ắt phải mượn chính tinh cung đối diện để luận đoán. Mệnh đối diện Thiên Di, tương tác qua lại, là chìa khóa mà người sơ học hay bỏ quên.',
  },
  {
    title: 'Tứ Hóa Chính Là Bàn Tay Vận Mệnh',
    body: 'Chính tinh là thể xác, Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) mới là linh hồn chuyển động. Cùng một sao, ngộ Hóa Lộc thì rực rỡ, ngộ Hóa Kỵ thì gian truân. Thầy nhắc đi nhắc lại: Không thấu Tứ Hóa thì mới giải được nửa lá số.',
  },
  {
    title: 'Đại Hạn Mười Năm, Vận Trình Có Nhịp',
    body: 'Đời người trải qua các đại hạn 10 năm. Ở mỗi đại hạn, con người bước vào một cung vị hoàn toàn mới với những bài học và cơ hội khác biệt. Thấu tỏ mình đang đi trong đại hạn nào mới nắm bắt đúng thời cơ.',
  },
];

// ─── Theme helper ──────────────────────────────────────────
function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    navBg:        d ? '#020810'                                : '#f5efe0',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldGrad:     d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                    : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    textFaint:    d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
    accent:       d ? '#3a78d4'                               : '#3a5a82',
    accentSoft:   d ? 'rgba(58,120,212,0.18)'                 : 'rgba(58,90,130,0.10)',
    cardBg:       d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:    d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:  d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    glowTint:     d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    glowBlue:     d ? 'rgba(40,80,160,0.12)'                  : 'rgba(58,90,130,0.06)',
    glowPurple:   d ? 'rgba(120,50,180,0.08)'                 : 'rgba(96,80,140,0.04)',
    niBg:         d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.8)',
    niBorder:     d ? 'rgba(212,168,67,0.2)'                  : 'rgba(180,130,40,0.25)',
    niDivider:    d ? 'rgba(255,255,255,0.08)'                : 'rgba(180,130,40,0.12)',
    niCardBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.9)',
    niCardBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    niCardShadow: d ? '0 2px 20px rgba(0,0,0,0.4)'           : '0 2px 16px rgba(140,100,20,0.1)',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    footerText:   d ? 'rgba(255,255,255,0.15)'               : '#8a7442',
    scrollLine:   d ? 'rgba(212,168,67,0.3)'                  : 'rgba(140,100,20,0.3)',
    scrollText:   d ? 'rgba(255,255,255,0.12)'                : '#c0a870',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    quoteBg:      d ? 'rgba(212,168,67,0.04)'                 : 'rgba(255,255,255,0.9)',
  };
}

// ─── Tứ Hóa giản lược ──────────────────────────────────────
const SIHUA_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Hóa Lộc': { attr: 'Cát hóa · Tăng ích tài lộc', brief: 'Phúc tinh giáng cung, chủ về tài lộc hanh thông, duyên may đưa tới. Sự việc cung này thuận buồm xuôi gió.' },
  'Hóa Quyền': { attr: 'Cát hóa · Uy quyền thống lĩnh', brief: 'Quyền tinh giáng cung, chủ về năng lực chỉ huy, quyền biến quyết đoán. Hợp nhất tại Quan Lộc và Mệnh.' },
  'Hóa Khoa': { attr: 'Cát hóa · Danh tiếng quý nhân', brief: 'Khoa danh giáng cung, chủ về danh tiếng thi cử, thanh nhã quý hiển, có quý nhân tương trợ hóa nguy thành an.' },
  'Hóa Kỵ': { attr: 'Hung hóa · Thử thách ràng buộc', brief: 'Kiếp số giáng cung, chủ về chấp niệm, thị phi hoặc trở ngại. Là bài học thử thách trui rèn bản lĩnh nhân sinh.' },
};

// ─── 14 Chính Tinh giản lược ──────────────────────────────
const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  'Tử Vi': { attr: 'Thổ · Đế Tinh', brief: 'Bắc Đẩu chúa tể, tôn quý thanh cao, có khí chất lãnh đạo bẩm sinh, hợp vị trí chỉ huy đứng đầu tổ chức.' },
  'Thiên Cơ': { attr: 'Mộc · Trí Tuệ Tinh', brief: 'Mưu sĩ đệ nhất, chủ về linh hoạt biến hóa, trí tuệ mẫn tiệp, thích hợp nghiên cứu, chiến lược, công nghệ kỹ thuật.' },
  'Thái Dương': { attr: 'Hỏa · Quan Lộc Chủ', brief: 'Quang minh chính đại, hào sảng nhiệt tình, trọng danh dự, đại diện cho công danh sự nghiệp quang huy.' },
  'Vũ Khúc': { attr: 'Kim · Tài Bạch Chủ', brief: 'Đệ nhất tài tinh, cương nghị quyết đoán, thực tế hành động, hợp tài chính, ngân hàng, công an quân sự.' },
  'Thiên Đồng': { attr: 'Thủy · Phúc Đức Tinh', brief: 'Phúc tinh trời ban, tính tình hòa nhã, thích an nhàn hưởng phúc, duyên người rất tốt, hậu vận ấm êm.' },
  'Liêm Trinh': { attr: 'Hỏa · Thứ Đào Hoa', brief: 'Đa tài đa nghệ, cá tính cương liệt, phong lưu thu hút, hợp nghệ thuật và tư pháp công quyền.' },
  'Thiên Phủ': { attr: 'Thổ · Tài Khố Tinh', brief: 'Nam Đẩu chủ tinh, sao giữ kho trời, đĩnh đạc cẩn trọng, tích lũy tài sản và bất động sản xuất sắc.' },
  'Thái Âm': { attr: 'Thủy · Điền Trạch Chủ', brief: 'Mẹ hiền vợ thảo, dịu dàng sâu lắng, giàu lòng trắc ẩn, vượng tài điền sản, khí chất nho nhã.' },
  'Tham Lang': { attr: 'Mộc Thủy · Đào Hoa Tinh', brief: 'Đa tài đa nghệ, tài ứng biến cao, xã giao quảng giao rộng mở, hợp kinh doanh và nghệ thuật sáng tạo.' },
  'Cự Môn': { attr: 'Thủy · Ám Tinh Hùng Biện', brief: 'Khẩu thiệt ngôn từ, tư duy sắc bén, phản biện chặt chẽ, hợp ngành luật sư, diễn giả, giáo dục truyền thông.' },
  'Thiên Tướng': { attr: 'Thủy · Ấn Thụ Tinh', brief: 'Quan ấn công đường, công chính liêm minh, trọng chữ tín, giữ nguyên tắc, hợp quản trị hành chính cấp cao.' },
  'Thiên Lương': { attr: 'Thổ · Ấm Tinh Thọ Tinh', brief: 'Sao che chở y dược và tôn giáo, đoan chính từ tâm, sớm gian nan sau thanh nhàn trường thọ.' },
  'Thất Sát': { attr: 'Kim Hỏa · Tướng Tinh', brief: 'Dũng tướng tiên phong, quả cảm quyết liệt, dám đột phá khai mở cục diện mới, hợp công nghiệp cạnh tranh.' },
  'Phá Quân': { attr: 'Thủy · Hao Tinh Tiên Phong', brief: 'Phá cũ lập mới, không sợ đổi thay, bản lĩnh ngang tàng khai sơn phá thạch, lập nên kỳ tích.' },
};

// ─── Minh họa tính năng ────────────────────────────────────
function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>Thuật Toán An Sao Thầy Nghê Hải Hạ</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { group: 'Tử Vi Hệ', stars: ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh'] },
          { group: 'Thiên Phủ Hệ', stars: ['Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300 font-medium"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => (
                <motion.button key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300 font-medium"
            style={{ color: c.textFaint }}>Tứ Hóa Phi Tinh</div>
          <div className="flex gap-2 flex-wrap">
            {[['Hóa Lộc', 'rgba(52,211,153,0.8)'], ['Hóa Quyền', 'rgba(96,165,250,0.8)'], ['Hóa Khoa', 'rgba(250,204,21,0.8)'], ['Hóa Kỵ', 'rgba(248,113,113,0.8)']].map(([label, color]) => (
              <motion.button key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.8', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{sel}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: 'Năm nay vận trình công danh sự nghiệp của tôi ra sao?' },
      { role: 'ai', text: 'Mệnh cung Thiên Cơ Hóa Lộc, đại hạn tiến nhập cung Quan Lộc, tam phương có Tả Phụ hội chiếu, sự nghiệp có quý nhân nâng đỡ, thích hợp chủ động mở rộng…' },
      { role: 'user', text: 'Giai đoạn nào đường tình cảm thuận hòa kết duyên nhất?' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: 'Sát Phá Lang Cách', desc: 'Mệnh cách khai phá tiên phong', ok: true },
      { name: 'Liêm Tướng Cách',   desc: 'Hành chính ấn thụ chưởng quyền', ok: true },
      { name: 'Hóa Kỵ nhập Mệnh', desc: 'Bài học tu dưỡng nội tâm', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          Tự động phát hiện 38+ cách cục tiêu chuẩn
        </div>
      </div>
    );
  }

  return null;
}

// ─── Trang chủ ─────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden font-sans">
      <AnnouncementModal />
      <StarField />

      {/* Hiệu ứng vầng sáng nền */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── Thanh điều hướng trên cùng ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
        style={{ background: c.navBg }}>
        <div className="text-[11px] sm:text-xs tracking-[0.25em] font-bold transition-colors duration-300 flex-shrink-0"
          style={{ color: c.goldSolid }}>
          TỬ VI ĐẨU SỐ
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/heming')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
            Hợp Bàn
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 font-semibold"
            style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
            An Lá Số Ngay
          </motion.button>
        </div>
      </nav>

      {/* ══ HERO SECTION ══════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: '960px' }} className="text-center w-full mx-auto mt-10">
          {/* Nhãn giới thiệu */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[11px] tracking-[0.3em] font-medium transition-colors duration-300" style={{ color: c.tagText }}>
              TỬ VI ĐẨU SỐ · NGHÊ HẢI HẠ CHÍNH TÔNG
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </motion.div>

          {/* Tiêu đề chính */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', display: 'inline-block' }}>
            <h1
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-extrabold leading-none mb-5`}
              style={{
                fontSize: 'clamp(44px, 8vw, 100px)',
                letterSpacing: '0.04em',
              }}>
              Tử Vi Đẩu Số
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg tracking-[0.08em] mb-2 font-medium"
            style={{ color: c.textSecond }}>
            Tử Vi là then chốt · Thiên Địa Nhân quy nhất · Nghê Hải Hạ chính tông
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm tracking-[0.15em] mb-6"
            style={{ color: c.textMuted, opacity: 0.85 }}>
            AI Đồng Hành · Tri Hành Hợp Nhất · Chân Thái Dương Thời 105°E
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: c.textMuted }}>
            Nhập ngày giờ sinh để an lập lá số Tử Vi Đẩu Số chuẩn mực cho 34 tỉnh thành Việt Nam — Tích hợp cổ thư toàn tập và luận giải chuyên sâu.
          </motion.p>

          {/* Nút kêu gọi hành động */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-12 py-4 font-bold text-base tracking-widest rounded-full shadow-lg"
              style={{ background: c.ctaBg, color: c.ctaText }}>
              An Lá Số Ngay
            </motion.button>
          </motion.div>

          {/* 14 Chính Tinh hiển thị */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 grid grid-cols-7 gap-1.5 max-w-[580px] mx-auto">
            {STARS.map((star, i) => (
              <motion.div key={star.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                className="flex items-center justify-center px-1.5 py-1 rounded-full"
                style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}>
                <span className="text-[11px] tracking-tight font-medium" style={{ color: c.starText }}>{star.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Thông báo cập nhật góc phải Desktop */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: -4 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute hidden lg:block pointer-events-none"
          style={{
            right: 'clamp(2%, 6vw, 8%)',
            top: '54%',
            maxWidth: '250px',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 8px 24px rgba(196,90,45,0.18), 0 2px 6px rgba(196,90,45,0.1)',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px', lineHeight: 1 }}>🇻🇳</div>
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#8b3a1a', fontWeight: 600 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '14px' }}>NQ 202/2025/QH15</span>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#8b3a1a', fontWeight: 500 }}>
              Chuẩn hóa 34 tỉnh thành<br />
              <strong style={{ color: '#c45a2d' }}>4 Mốc Giờ Lịch Sử VN</strong>
            </div>
          </div>
        </motion.div>

        {/* Thông báo Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:hidden mx-auto mt-8 mb-2 pointer-events-none"
          style={{ maxWidth: 'min(280px, 84vw)' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 6px 18px rgba(196,90,45,0.16), 0 2px 4px rgba(196,90,45,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px', lineHeight: 1 }}>🇻🇳</div>
            <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#8b3a1a', fontWeight: 600 }}>
              34 Tỉnh Thành Mới · 4 Mốc Giờ Lịch Sử
            </div>
          </div>
        </motion.div>

        {/* Gợi ý cuộn chuột */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: c.scrollText }}>Khám Phá Thêm</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }} />
        </motion.div>
      </section>

      {/* ══ TRIẾT LÝ MỆNH LÝ ═════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, #f5efe0 0%, #f5efe0 6%, #c08055 18%, #6a2810 32%, #1e0a02 50%, #1e0a02 70%, #6a2810 84%, #f5efe0 100%)',
            transition: 'background 0.4s ease',
          }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bold" style={{ fontSize: 'clamp(180px, 32vw, 400px)', color: 'rgba(212,168,67,0.012)', lineHeight: 1, fontFamily: 'serif' }}>MỆNH</span>
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45))' }} />
            <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: 'rgba(212,168,67,0.6)' }}>MỆNH · VẬN · ĐẠO</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45))' }} />
          </div>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { text: 'Ý nghĩa của việc sớm thấu hiểu mệnh vận', size: 'clamp(16px, 2.2vw, 26px)', color: 'rgba(215,228,252,0.75)', delay: 0.1 },
              { text: 'Không nằm ở việc định sẵn tương lai', size: 'clamp(20px, 2.6vw, 30px)', color: 'rgba(220,232,250,0.8)', delay: 0.25 },
              { text: 'Mà là để không ngừng thấu hiểu chính mình', size: 'clamp(22px, 3vw, 38px)', color: 'rgba(218,230,248,0.85)', delay: 0.34 },
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-wide" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 46px)', letterSpacing: '0.03em', lineHeight: 1.35 }}>
              Tự tay kiến tạo nên kịch bản nhân sinh rực rỡ của chính mình
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ TIẾN TRÌNH HỌC THUẬT ══════════════════════════ */}
      <section className="relative z-10 py-20 lg:py-24 px-6"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.03) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.04) 50%, transparent 100%)',
        }}>
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: c.goldSolid, opacity: 0.8 }}>Hệ Thống Tri Thức</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <div className="text-2xl lg:text-3xl font-bold mb-2 tracking-wide" style={{ color: c.textPrimary }}>
            Phương Pháp Luận Thầy Nghê Hải Hạ
          </div>
          <div className="text-xs lg:text-sm tracking-wide" style={{ color: c.textMuted }}>
            Khởi đầu từ Tử Vi, từng bước mở rộng Thiên Kỷ · Địa Kỷ · Nhân Kỷ
          </div>
        </FadeIn>

        <div className="max-w-sm lg:max-w-5xl mx-auto relative">
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background: `linear-gradient(90deg, ${c.goldSolid} 0%, ${c.goldSolid} 25%, ${c.goldLine} 25%)`,
              opacity: 0.6,
            }} />
          <div className="lg:hidden absolute left-7 top-7 bottom-7 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, ${c.goldSolid} 0%, ${c.goldSolid} 22%, ${c.goldLine} 22%)`,
              opacity: 0.6,
            }} />

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4">
            {SECTIONS.map((s, i) => {
              const ready = s.status === 'ready';
              return (
                <motion.div key={s.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center gap-4 lg:gap-0">
                  <div className="relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center lg:mb-3"
                    style={{
                      background: ready
                        ? `linear-gradient(135deg, ${c.goldSolid} 0%, ${c.goldSolid}cc 100%)`
                        : (theme === 'dark' ? 'rgba(184,146,42,0.05)' : '#fdf8ee'),
                      border: ready ? 'none' : `2px dashed ${c.goldLine}`,
                      color: ready ? '#fff' : c.textMuted,
                      boxShadow: ready ? `0 4px 16px ${c.goldSolid}55` : 'none',
                    }}>
                    <span className="text-2xl">{s.icon}</span>
                    {ready && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ background: '#10b981', boxShadow: '0 2px 6px rgba(16,185,129,0.4)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-center min-w-0">
                    <div className="flex items-baseline gap-2 lg:flex-col lg:gap-0 lg:mb-1">
                      <div className="text-[10px] tracking-wider lg:mb-1.5"
                        style={{ color: ready ? '#10b981' : c.textMuted, fontWeight: 500 }}>
                        {s.when}
                      </div>
                      <div className="text-base lg:text-xl font-bold tracking-wide"
                        style={{ color: c.textPrimary }}>
                        {s.name}
                      </div>
                      {s.note && (
                        <div className="text-[9px] px-2 py-0.5 rounded-full lg:hidden"
                          style={{
                            color: c.goldSolid,
                            background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                            border: `1px solid ${c.goldLine}`,
                            opacity: 0.85,
                          }}>
                          {s.note}
                        </div>
                      )}
                    </div>
                    {s.note && (
                      <div className="hidden lg:block text-[9px] mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          color: c.goldSolid,
                          background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                          border: `1px solid ${c.goldLine}`,
                          opacity: 0.85,
                        }}>
                        {s.note}
                      </div>
                    )}
                    <div className="text-[11px] lg:text-xs leading-relaxed lg:max-w-[200px] mt-0.5 lg:mt-0"
                      style={{ color: c.textSecond }}>
                      {s.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CHI TIẾT TÍNH NĂNG ═══════════════════════════ */}
      <section className="relative z-10">
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: c.tagText }}>{feature.tag}</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-extrabold leading-tight mb-5`}
                      style={{
                        fontSize: i < 2 ? 'clamp(32px, 3.8vw, 52px)' : 'clamp(28px, 3.2vw, 44px)',
                        whiteSpace: 'pre-line',
                      }}>
                      {feature.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed font-medium" style={{ color: c.textSecond }}>{feature.subtitle}</p>
                  </FadeIn>
                  <div className="space-y-4">
                    {feature.points.map((point, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ background: c.goldSolid, opacity: 0.8 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ THIÊN - ĐỊA - NHÂN TAM PHÂN LUẬN ══════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: c.tagText }}>Triết Lý Mệnh Đạo</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thiên · Địa · Nhân
              </h2>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                Quan điểm nhân sinh cốt lõi của Thầy Nghê Hải Hạ: Vận mệnh tiên thiên không bao giờ là toàn bộ đời người.<br />
                Ông chia các nguồn lực chi phối cuộc đời thành ba chiều không gian bình đẳng.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { glyph: 'Thiên', label: 'Tiên Thiên Mệnh Số', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: 'Tử Vi Đẩu Số hé mở bản đồ tiên thiên — bố cục tinh diệu, cục diện ngũ hành, chính tinh thủ Mệnh theo thời khắc chào đời. Đó là tấm phông nền của cuộc đời, chỉ chiếm một phần ba chứ không phải tất cả.', sub: 'Mệnh Bàn · Tinh Diệu · Ngũ Hành' },
              { glyph: 'Địa', label: 'Địa Lý Môi Trường', pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', desc: 'Nơi chốn bạn sinh sống, kinh tuyến địa lý, phong thủy không gian, cùng bối cảnh gia đình xã hội cấu thành chiều kích thứ hai. Cùng một lá số, sinh ra ở những vùng đất khác nhau sẽ có trải nghiệm và cơ hội dị biệt.', sub: 'Địa Lý · Môi Trường · Phong Thủy' },
              { glyph: 'Nhân', label: 'Ý Chí Con Người', pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', desc: 'Ý chí, phẩm hạnh, lựa chọn đạo đức và nỗ lực hành động của bản thân là lực lượng chủ động nhất để chuyển hóa số mệnh. Hiểu mệnh là để sống trọn vẹn hơn chứ không phải ngồi chờ số phận an bài.', sub: 'Ý Chí · Lựa Chọn · Hành Động' },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-4xl font-extrabold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-widest" style={{ color: c.textMuted }}>Nhân sinh</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-semibold mb-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed italic" style={{ color: c.textSecond }}>
                "Số mệnh không phải toàn bộ đời người. Phải cộng thêm vị trí địa lý và tâm niệm con người mới thành trọn vẹn."
              </p>
              <p className="mt-2 text-[10px] tracking-widest font-semibold" style={{ color: c.tagText }}>— Thầy Nghê Hải Hạ</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ GIỚI THIỆU THẦY NGHÊ HẢI HẠ ══════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: c.tagText }}>Đại Sư · 1954 – 2012</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-6 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thầy Nghê Hải Hạ
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                Một trong những bậc danh sư Đông y và thuật số có tầm ảnh hưởng sâu rộng nhất thời hiện đại<br />
                Sáng lập Viện Trung Y Hán Đường tại Hoa Kỳ · Để lại hai bộ đại nghiệp giảng dạy truyền đời:「Nhân Kỷ」và「Thiên Kỷ」
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-10 mb-8"
              style={{ border: `1px solid ${c.niBorder}`, background: c.niBg, boxShadow: c.cardShadow }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Năm Sinh', value: '1954', sub: 'Đài Loan' },
                  { label: 'Tạ Thế', value: '2012', sub: '31 tháng 1 · Hưởng thọ 58 tuổi' },
                  { label: 'Di Sản', value: 'Tử Vi Đẩu Số', sub: 'Kinh Phương Đông Y · Chu Dịch' },
                ].map(item => (
                  <div key={item.label} className="text-center rounded-xl px-4 py-3"
                    style={{ border: `1px solid ${c.niDivider}`, background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-[10px] tracking-wider mb-1" style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-2xl font-bold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-[11px]" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="h-px mb-8" style={{ background: c.niDivider }} />
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
                <p>
                  <strong style={{ color: c.goldSolid }}>Hành trình cuộc đời</strong>:
                  Tiên sinh Nghê Hải Hạ (1954–2012) sinh tại Đài Loan, từ thời trẻ đã bái sư nhiều bậc danh gia y thuật và thuật số. Về sau sang Mỹ hành nghề y, sáng lập <strong>Viện Trung Y Hán Đường</strong> tại Florida, giảng dạy và đào tạo nhiều thế hệ học trò.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Hệ thống giảng dạy</strong>:
                  Thầy đúc kết toàn bộ sở học thành hai bộ đại hệ thống giảng dạy công khai:
                  <strong>「Nhân Kỷ」</strong> bao quát Châm Cứu Đại Thành, Thần Nông Bản Thảo Kinh, Hoàng Đế Nội Kinh, Thương Hàn Luận, Kim Quỹ Yếu Lược — đặt nền tảng y thuật cứu người;
                  <strong>「Thiên Kỷ」</strong> bao quát Tử Vi Đẩu Số và Chu Dịch — nghiên cứu thiên văn và vận mệnh con người.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Trường phái Tử Vi</strong>:
                  Thầy thuộc phái <strong>Tam Hợp Phái</strong>, chủ trương: "Lấy Mệnh cung làm gốc, lấy Tam phương tứ chính làm dụng, lấy Tứ Hóa làm cương lĩnh". Thầy phản đối việc suy diễn phi hóa quá rườm rà phức tạp xa rời thực tế, luôn nhấn mạnh nguyên tắc "Đại đạo chí giản".
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Tinh thần học thuật</strong>:
                  Thầy bài trừ mê tín dị đoan, kiên quyết phản đối việc học vẹt thuộc lòng khẩu quyết vô căn cứ. Thầy nhấn mạnh: "Hiểu rõ nguyên lý hơn học vẹt", "Logic có thể kiểm chứng được hơn là huyền bí mơ hồ".
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px] font-bold" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-semibold leading-relaxed" style={{ color: c.goldSolid }}>{teaching.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>{teaching.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HỢP BÀN ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="rounded-2xl p-10 md:p-14 text-center"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}>
            <FadeIn>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: c.goldLine }} />
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: c.tagText }}>Tương Hợp · Luận Giải</span>
                <div className="h-px w-8" style={{ background: c.goldLine }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                Tử Vi Hợp Bàn
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: c.textSecond }}>
                Nhập thông tin ngày giờ sinh của hai người để AI đối chiếu tương hỗ cung Phu Thê, độ tương thích của Mệnh cung và thế tam phương tứ chính,<br className="hidden md:block" />
                đưa ra đánh giá tương hợp tình duyên, khả năng hợp tác kinh doanh và lời khuyên hòa hợp gia đạo.
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {['Độ tương hợp tình duyên', 'Đánh giá hợp tác khởi nghiệp', 'Duyên phận cha mẹ & con cái', 'Lời khuyên thấu hiểu lẫn nhau'].map(item => (
                  <span key={item} style={{
                    fontSize: '12px', padding: '5px 14px', borderRadius: '20px',
                    background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.12)',
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/heming')}
                className="px-10 py-3 font-semibold text-sm tracking-wide rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(140,100,20,0.1)',
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  cursor: 'pointer',
                }}>
                Bắt Đầu Phân Tích Hợp Bàn
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ CTA CUỐI CÙNG ═════════════════════════════════ */}
      <section className="relative z-10 py-36 px-6 text-center" style={{ background: c.altSection }}>
        <FadeIn>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-6 font-bold" style={{ color: c.tagText }}>Bắt đầu hành trình chiêm nghiệm</p>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-extrabold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            Lá Số Tử Vi Của Bạn<br />Đang Chờ Được Mở Ra
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Chỉ với vài thao tác nhập ngày giờ sinh, khởi tạo ngay lá số Tử Vi Đẩu Số cá nhân chuẩn mực<br />
            và đón nhận những góc nhìn sâu sắc từ trí tuệ tiền nhân kết hợp AI
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-bold text-base tracking-widest rounded-full shadow-lg"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            An Lá Số Miễn Phí
          </motion.button>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-wider inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              ✦ Kho Tri Thức Tử Vi →
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-wider inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              📜 Thư Viện Cổ Thư Toàn Văn →
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════ */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-[9px] tracking-widest text-center mb-4 uppercase font-semibold"
            style={{ color: c.textMuted, opacity: 0.8 }}>
            Hệ Thống Học Thuật Thầy Nghê Hải Hạ
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SECTIONS.map(s => {
              const ready = s.status === 'ready';
              return (
                <a
                  key={s.key}
                  href={ready ? '/chart' : undefined}
                  onClick={ready ? undefined : (e) => e.preventDefault()}
                  className="rounded-lg px-3 py-3 text-center transition-all"
                  style={{
                    background: ready ? c.starBg : 'transparent',
                    border: `1px ${ready ? 'solid' : 'dashed'} ${ready ? c.goldLine : c.navBorder}`,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    opacity: ready ? 1 : 0.6,
                    textDecoration: 'none',
                  }}
                >
                  <div className="text-base font-bold mb-0.5 tracking-wide"
                    style={{ color: ready ? c.goldSolid : c.textMuted }}>
                    {s.name}
                  </div>
                  <div className="text-[10px] tracking-wider font-medium"
                    style={{ color: ready ? '#10b981' : c.textMuted }}>
                    {ready ? '✓ Đang hoạt động' : `${s.when}`}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[11px] tracking-wide mb-2" style={{ color: c.footerText }}>
            Tử Vi Đẩu Số · Dựa trên hệ thống Nghê Hải Hạ Chính Tông · Vận mệnh nằm trong tay chính bạn
          </p>
          <p className="text-[10px] tracking-wide mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            Nền tảng phục vụ nghiên cứu văn hóa cổ học truyền thống và học tập chiêm nghiệm.<br className="sm:hidden" />
            Không cấu thành lời khuyên y tế, đầu tư tài chính hay pháp lý.
          </p>
          <p className="text-[11px] tracking-wide" style={{ color: c.footerText }}>
            <a href="/terms" style={{ color: c.footerText, textDecoration: 'underline' }}>Điều khoản sử dụng</a>
            {' · '}
            <a href="/privacy" style={{ color: c.footerText, textDecoration: 'underline' }}>Chính sách quyền riêng tư</a>
          </p>
        </div>
      </footer>
    </div>
  );
}