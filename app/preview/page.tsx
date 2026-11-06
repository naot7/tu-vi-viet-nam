'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollIntro from '@/components/ScrollIntro';

export default function PreviewPage() {
  const router = useRouter();
  const [replayKey, setReplayKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <>
      {/* Hiệu ứng cuộn thư khai màn */}
      <ScrollIntro key={replayKey} onComplete={() => setDone(true)} />

      {done && (
        <main style={{
          minHeight: '100vh',
          background: '#0d0a08',
          color: '#e8dcc4',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: '"Noto Serif", serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#c89647', marginBottom: '16px' }}>
            HIỆU ỨNG CUỘN THƯ · XEM TRƯỚC
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '0.08em',
            color: '#e8dcc4',
            marginBottom: '16px',
            fontWeight: 700,
          }}>
            Khai Màn Tử Vi Đẩu Số
          </h1>
          <p style={{
            fontSize: '14px', color: '#a89878',
            maxWidth: '520px', lineHeight: 1.9,
            letterSpacing: '0.04em',
            marginBottom: '40px',
          }}>
            Hiệu ứng cuộn thư mở ra không gian cổ kính thanh nhã mỗi khi truy cập nền tảng.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setDone(false); setReplayKey(k => k + 1); }}
              style={{
                background: '#a8302a',
                color: '#f5ecd7',
                padding: '14px 28px',
                fontSize: '14px',
                letterSpacing: '0.1em',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '6px',
              }}
            >
              Phát Lại Một Lần Nữa
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#e8dcc4',
                padding: '14px 28px',
                fontSize: '14px',
                letterSpacing: '0.1em',
                border: '1px solid rgba(232,220,196,0.25)',
                cursor: 'pointer',
                borderRadius: '6px',
              }}
            >
              Vào Trang Chủ Chính
            </button>
          </div>

          <div style={{
            marginTop: '40px', fontSize: '12px', color: '#6e6048',
            letterSpacing: '0.1em',
            display: 'flex', gap: '20px',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang Chủ ↗</Link>
            <span>·</span>
            <Link href="/chart" style={{ color: 'inherit', textDecoration: 'none' }}>An Lá Số</Link>
            <span>·</span>
            <Link href="/heming" style={{ color: 'inherit', textDecoration: 'none' }}>Hợp Bàn</Link>
          </div>
        </main>
      )}
    </>
  );
}