// neo-lms/frontend/src/app/layout.tsx
import '@/styles/tailwind.css';
import type { Metadata } from 'next';
import { TopLoader } from '@/components/top-loader';
import { SiteThemeProvider } from '@/components/site-theme-provider';

export const metadata: Metadata = {
  title: {
    template: '%s - پردیس هوش مصنوعی',
    default: 'پردیس هوش مصنوعی - اولین نئو ال ام اس ایرانی',
  },
  description: 'اولین پلتفرم نئو ال ام اس ایرانی مبتنی بر هوش مصنوعی.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* حذف فونت انگلیسی Switzer و جایگزینی با فونت فارسی وزیرمتن */}
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="وبلاگ پردیس هوش مصنوعی"
          href="/blog/feed.xml"
        />
      </head>
      <body className="antialiased">
        <SiteThemeProvider>
          <TopLoader />
          {children}
        </SiteThemeProvider>
      </body>
    </html>
  );
}
