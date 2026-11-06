/**
 * /library/search?q=xxx — Trang kết quả tra cứu cổ thư
 */

import Link from 'next/link';
import { searchClassics, getParagraphById } from '@/lib/classics';

export const metadata = {
  title: 'Kết Quả Tra Cứu · Thư Viện Cổ Thư Tử Vi Đẩu Số',
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || '';
  const hits = q ? searchClassics(q, 50) : [];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none', fontWeight: 500 }}>
          ← Thư Viện Cổ Thư
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.1em', fontWeight: 600 }}>
          KẾT QUẢ TRA CỨU
        </div>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none', fontWeight: 500 }}>
          Trang Chủ →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '4px' }}>
            Từ khóa tra cứu
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.04em' }}>
            "{q || '（Trống）'}"
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--tx-3)', marginTop: '8px' }}>
            Tìm thấy <strong style={{ color: 'var(--ac)' }}>{hits.length}</strong> đoạn văn bản cổ thư tương ứng
          </div>
        </div>

        {hits.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            padding: '40px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--tx-2)',
            border: '1px solid rgba(184,146,42,0.15)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📜</div>
            {q ? (
              <>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>Tạm thời chưa tìm thấy đoạn văn nào chứa từ khóa này</div>
                <div style={{ fontSize: '11px', color: 'var(--tx-3)', lineHeight: 1.7 }}>
                  Quý bạn có thể thử tra cứu các từ khóa phổ biến:<br />
                  <span style={{ color: 'var(--ac)' }}>Thất Sát Triều Đẩu / Song Lộc Triều Viên / Hóa Kỵ / Tử Vi / Mệnh cung / Cơ Nguyệt Đồng Lương</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: '13px' }}>Vui lòng nhập từ khóa cần tìm kiếm</div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hits.map((hit, i) => {
              const ctx = getParagraphById(hit.paragraphId);
              const chapterIdx = ctx?.chapterIdx ?? 0;
              return (
                <Link
                  key={i}
                  href={`/library/${hit.bookSlug}/${chapterIdx}#${hit.paragraphId}`}
                  style={{
                    display: 'block',
                    background: 'var(--bg-card)',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(184,146,42,0.18)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    color: 'var(--tx-3)',
                    marginBottom: '8px',
                    letterSpacing: '0.05em',
                  }}>
                    <span style={{ color: 'var(--ac)', fontWeight: 600 }}>《{hit.bookTitle}》</span>
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span>{hit.chapterTitle}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--tx-0)', lineHeight: 1.7 }}>
                    {hit.text}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}