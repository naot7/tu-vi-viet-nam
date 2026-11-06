/**
 * /knowledge — Trang chủ Kho Tri Thức Tử Vi Đẩu Số
 * 14 Chính Tinh × 13 Cung Vị Luận Giải
 */

import Link from 'next/link';
import { ALL_STARS, ALL_TOPICS, getKnowledge, STAR_BRIEF_SEO, STAR_TO_SLUG } from '@/lib/seo/knowledge';
import { TOPIC_LABEL } from '@/lib/ziwei/db-analysis';

export const metadata = {
  title: 'Kho Tri Thức Tử Vi Đẩu Số · 14 Chính Tinh × 13 Cung Vị · Nghê Hải Hạ Chính Tông',
  description: 'Kho tri thức Tử Vi Đẩu Số biên soạn dựa trên giáo trình《Thiên Kỷ》của Thầy Nghê Hải Hạ và các bộ cổ thư kinh điển《Tử Vi Đẩu Số Toàn Tập》,《Cốt Tủy Phú》. Bao quát toàn diện 14 chính tinh tọa thủ tại 13 cung vị.',
  keywords: ['Tử Vi Đẩu Số', 'Nghê Hải Hạ', 'Tử Vi Đẩu Số Toàn Tập', 'Cốt Tủy Phú', '14 chính tinh', '12 cung'],
};

export default function KnowledgeHomePage() {
  const STAR_DESCRIPTIONS_QUICK = STAR_BRIEF_SEO;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Thanh Header */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none', fontWeight: 500 }}>
          ← Trang Chủ
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.1em', fontWeight: 600 }}>
          KHO TRI THỨC MỆNH LÝ
        </div>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none', fontWeight: 500 }}>
          Cổ Thư →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-14">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.2em', fontWeight: 600 }}>NGHÊ HẢI HẠ · TRI THỨC TỬ VI</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.04em', marginBottom: '12px' }}>
          Kho Tri Thức Tử Vi Đẩu Số
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', letterSpacing: '0.02em', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
          14 Chính Tinh × 13 Cung Vị = <strong style={{ color: 'var(--ac)' }}>{ALL_STARS.length * ALL_TOPICS.length}</strong> chuyên đề luận đoán chuyên sâu<br />
          Biên soạn chuẩn mực theo hệ thống《Thiên Kỷ》Thầy Nghê Hải Hạ & Cổ Thư
        </p>
      </div>

      {/* 14 Chính Tinh lưới nhanh */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.2em', textAlign: 'center', marginBottom: '24px', fontWeight: 600 }}>
          MƯỜI BỐN CHÍNH TINH
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_STARS.map(star => (
            <Link
              key={star}
              href={`/knowledge/${STAR_TO_SLUG[star]}/overview`}
              style={{
                display: 'block',
                padding: '14px 10px',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '10px',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              className="hover:shadow-md hover:border-amber-400"
            >
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.04em' }}>
                {star}
              </div>
            </Link>
          ))}
        </div>

        {/* Danh sách chi tiết từng sao và cung vị */}
        <div className="mt-14 space-y-4">
          {ALL_STARS.map(star => (
            <div key={star} style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(184,146,42,0.18)',
              borderRadius: '12px',
              padding: '18px 22px',
            }}>
              <div className="flex items-baseline gap-3 mb-2">
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.02em' }}>
                  Sao {star}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>
                  14 CHÍNH TINH
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '12px' }}>
                {STAR_DESCRIPTIONS_QUICK[star] || ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_TOPICS.map(t => {
                  const k = getKnowledge(star, t);
                  if (!k.exists) return null;
                  return (
                    <Link
                      key={t}
                      href={`/knowledge/${STAR_TO_SLUG[star]}/${t}`}
                      style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        background: 'rgba(184,146,42,0.06)',
                        border: '1px solid rgba(184,146,42,0.15)',
                        borderRadius: '999px',
                        color: 'var(--tx-2)',
                        textDecoration: 'none',
                      }}
                    >
                      Tại {k.palaceName} · {TOPIC_LABEL[t]}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}