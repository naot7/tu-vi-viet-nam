import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Tử Vi Đẩu Số · Nghê Hải Hạ Chính Tông',
  description: 'Ứng dụng luận giải Tử Vi Đẩu Số chuẩn xác theo hệ thống Thầy Nghê Hải Hạ, tra cứu Chân Thái Dương Thời 105°E, địa lý 34 tỉnh thành Việt Nam, giải đoán toàn diện mệnh cách, đại hạn, lưu niên.',
  keywords: 'Tử Vi, Tử Vi Đẩu Số, Nghê Hải Hạ, Cốt Tủy Phú, Tử Vi Đẩu Số Toàn Tập, Tử Vi Đẩu Số Toàn Thư, lá số tử vi, 14 chính tinh, 12 cung',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tử Vi Đẩu Số · Nghê Hải Hạ Chính Tông',
    description: 'Ứng dụng luận giải Tử Vi Đẩu Số chuẩn xác theo hệ thống Thầy Nghê Hải Hạ, tra cứu Chân Thái Dương Thời 105°E, địa lý 34 tỉnh thành Việt Nam, giải đoán toàn diện mệnh cách, đại hạn, lưu niên.',
    url: SITE_URL,
    siteName: 'Tử Vi Đẩu Số',
    locale: 'vi_VN',
    type: 'website',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}