/**
 * Thư Viện Cổ Thư Toàn Văn · Trang Chủ
 * Danh sách 3 bộ cổ thư: Cốt Tủy Phú, Tử Vi Đẩu Số Toàn Tập, Tử Vi Đẩu Số Toàn Thư
 */

import Link from 'next/link';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import LibrarySearch from './LibrarySearch';

export const metadata = {
  title: 'Thư Viện Cổ Thư Toàn Văn · Tử Vi Đẩu Số Toàn Tập / Toàn Thư / Cốt Tủy Phú',
  description: 'Tra cứu toàn văn ba bộ cổ thư kinh điển của Tử Vi Đẩu Số: 《Tử Vi Đẩu Số Toàn Tập》, 《Tử Vi Đẩu Số Toàn Thư》, 《Cốt Tủy Phú》kèm âm Hán-Việt và bản dịch nghĩa.',
};

export default function LibraryHomePage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Thanh Header */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none', fontWeight: 500 }}>
          ← Trang Chủ
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.15em', fontWeight: 600 }}>
          THƯ VIỆN CỔ THƯ TOÀN VĂN
        </div>
        <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none', fontWeight: 500 }}>
          An Lá Số →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.2em', fontWeight: 600 }}>NGHÊ HẢI HẠ · NGUYÊN ĐIỂN CỔ THƯ</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.04em', marginBottom: '12px' }}>
          Thư Viện Cổ Thư Tử Vi Đẩu Số
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', letterSpacing: '0.02em', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
          Tra cứu toàn văn các bộ cổ tịch Tử Vi Đẩu Số kinh điển<br />
          Thu thập <strong style={{ color: 'var(--ac)' }}>{ALL_BOOKS.length}</strong> bộ đại tác phẩm · Tổng cộng <strong style={{ color: 'var(--ac)' }}>{TOTAL_PARAGRAPHS}</strong> đoạn tinh hoa dịch giải
        </p>
      </div>

      {/* Khung tìm kiếm */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <LibrarySearch />
      </div>

      {/* Danh sách 3 bộ cổ thư */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BOOKS.map(book => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              style={{
                display: 'block',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '14px',
                padding: '24px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(184,146,42,0.06)',
              }}
              className="hover:shadow-lg"
            >
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '6px' }}>
                {book.dynasty} · {book.author.split(' ')[0]}
              </div>
              <div style={{ fontSize: '19px', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '10px', letterSpacing: '0.02em' }}>
                《{book.title}》
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
                {book.intro}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--tx-3)' }}>
                <span>{book.chapters.length} Chương / Quyển</span>
                <span style={{ color: 'rgba(184,146,42,0.4)' }}>·</span>
                <span>{book.chapters.reduce((s, c) => s + c.paragraphs.length, 0)} Đoạn tinh hoa</span>
              </div>
              <div style={{
                display: 'inline-flex',
                marginTop: '14px',
                fontSize: '11px',
                color: 'var(--ac)',
                letterSpacing: '0.05em',
                fontWeight: 600,
              }}>
                Vào đọc tác phẩm →
              </div>
            </Link>
          ))}
        </div>

        {/* Thông tin thêm */}
        <div style={{ marginTop: '60px', padding: '24px', background: 'rgba(184,146,42,0.05)', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>
            VỀ KHO TƯ LIỆU NGUYÊN ĐIỂN
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            Toàn bộ các tác phẩm cổ thư được số hóa từ các bản khắc thời Minh, kèm phiên âm Hán-Việt chuẩn xác và bản dịch Quốc ngữ tỉ mỉ đối chiếu lời bình của Thầy Nghê Hải Hạ trong giáo trình《Thiên Kỷ》.
          </div>
        </div>
      </div>
    </div>
  );
}