// neo-lms/frontend/src/app/page.tsx
import HeroParticlesCanvas from '@/components/hero-particles-canvas'
import { BentoCard } from '@/components/bento-card'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient } from '@/components/gradient'
import { Keyboard } from '@/components/keyboard'
import { Link } from '@/components/link'
import { LinkedAvatars } from '@/components/linked-avatars'
import { LogoCloud } from '@/components/logo-cloud'
import { LogoCluster } from '@/components/logo-cluster'
import { LogoTimeline } from '@/components/logo-timeline'
import { Map } from '@/components/map'
import { Navbar } from '@/components/navbar'
import { Screenshot } from '@/components/screenshot'
import { Testimonials } from '@/components/testimonials'
import { Heading, Subheading } from '@/components/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description:
    'پلتفرم آموزشی دپارتمان پردیس هوش مصنوعی و نوآوری دیجیتال ایران برای یادگیری تخصصی AI، رباتیک و اینترنت اشیا.',
}

function Hero() {
  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-4xl">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset z-0" />
      <div className="aurora rounded-4xl inset-2 z-10" aria-hidden="true"></div>
      <Container className="relative z-20">
        <Navbar
          banner={
            <Link
              href="#"
              className="flex items-center gap-1 rounded-full bg-pardis-primary-100 px-3 py-0.5 text-sm/6 font-medium text-pardis-primary-800 data-hover:bg-pardis-primary-200"
            >
              دپارتمان آموزش پردیس هوش مصنوعی و نوآوری دیجیتال ایران
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 items-center md:grid-cols-12">
          <div className="order-2 md:order-1 md:col-span-6 p-6 md:pr-12 text-center md:text-right">
            <h1 className="font-display text-4xl/[1.15] font-medium tracking-tight text-gray-950 sm:text-6xl/[1.05] md:text-6xl/[1]">
              تو قهرمان این داستانی.
            </h1>
            <p className="mt-6 max-w-[42ch] md:max-w-[40ch] md:ml-auto text-xl/7 font-medium text-gray-700 sm:text-2xl/8">
              آینده را کسی می‌سازد که باور کند می‌تواند — و از همین‌جا شروع کند.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
              <span className="rounded-full border border-pardis-primary/20 bg-white/70 px-3 py-1 text-sm/6 text-gray-700">
                پروژه‌محور
              </span>
              <span className="rounded-full border border-pardis-primary/20 bg-white/70 px-3 py-1 text-sm/6 text-gray-700">
                رودمپ شفاف
              </span>
              <span className="rounded-full border border-pardis-primary/20 bg-white/70 px-3 py-1 text-sm/6 text-gray-700">
                جامعهٔ فعال
              </span>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-start">
              <Button href="/courses" className="w-full sm:w-auto">
                شروع یادگیری
              </Button>
              <Button href="/login" variant="secondary" className="w-full sm:w-auto">
                پیوستن به پردیس
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2 md:col-span-6 relative h-[360px] md:h-[560px] overflow-visible">
            <div className="absolute top-1/8 md:-right-100 -translate-y-1/2 w-[120%] md:w-[120%] h-[680px] md:h-[560px]">
              <HeroParticlesCanvas text="AI" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

function FeatureSection() {
  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Heading as="h2" className="max-w-3xl">
          تصویری کامل از مسیر پیشرفت شما در یادگیری.
        </Heading>
        <Screenshot
          width={1216}
          height={768}
          src="/screenshots/app.png"
          className="mt-16 h-[36rem] sm:h-auto sm:w-[76rem]"
        />
      </Container>
    </div>
  )
}

function BentoSection() {
  return (
    <Container>
      <Subheading>مسیر یادگیری</Subheading>
      <Heading as="h3" className="mt-2 max-w-3xl">
        یک پلتفرم متمرکز برای یادگیری عمیق.
      </Heading>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        <BentoCard
          eyebrow="رودمپ"
          title="نقشه راه مطمئن و شفاف"
          description="دیگر نگران نباشید که از کجا شروع کنید. ما یک مسیر یادگیری (Roadmap) ثابت و بهینه بر اساس نیاز صنعت ارائه می‌دهیم. گام‌های شما برای رسیدن به تخصص، از روز اول مشخص است."
          graphic={
            <div className="h-80 bg-[url(/screenshots/profile.png)] bg-[size:1000px_560px] bg-[left_-109px_top_-112px] bg-no-repeat" />
          }
          fade={['bottom']}
          className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
        />
        <BentoCard
          eyebrow="محتوا"
          title="محتوای متمرکز و پروژه‌محور"
          description="به جای ویدیوهای طولانی، با مینی‌دوره‌های متنی عمیق و چالش‌های عملی یاد بگیرید. ما بر درک مفاهیم و ساختن نمونه‌کار واقعی تمرکز داریم."
          graphic={
            <div className="absolute inset-0 bg-[url(/screenshots/competitors.png)] bg-[size:1100px_650px] bg-[left_-38px_top_-73px] bg-no-repeat" />
          }
          fade={['bottom']}
          className="lg:col-span-3 lg:rounded-tr-4xl"
        />
        <BentoCard
          eyebrow="سرعت"
          title="ساخته شده برای کاربران حرفه‌ای"
          description="با میان‌برهای کیبورد که برای سرعت بهینه شده‌اند، سریع‌تر از همیشه بین درس‌ها و پروژه‌ها جابجا شوید."
          graphic={
            <div className="flex size-full pt-10 pl-10">
              <Keyboard highlighted={['LeftCommand', 'LeftShift', 'D']} />
            </div>
          }
          className="lg:col-span-2 lg:rounded-bl-4xl"
        />
        <BentoCard
          eyebrow="منابع"
          title="دسترسی به منابع گسترده"
          description="فراتر از دوره‌های ویدیویی، به مقالات، پروژه‌ها و چالش‌های واقعی برای ساختن یک رزومه قوی دسترسی داشته باشید."
          graphic={<LogoCluster />}
          className="lg:col-span-2"
        />
        <BentoCard
          eyebrow="جهانی"
          title="یادگیری در سطح جهانی"
          description="پردیس به شما کمک می‌کند تا با جدیدترین متدها و استانداردهای جهانی آموزش ببینید و رقابت کنید."
          graphic={<Map />}
          className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl"
        />
      </div>
    </Container>
  )
}

function DarkBentoSection() {
  return (
    <div className="mx-2 mt-2 rounded-4xl bg-linear-to-br from-pardis-secondary/90 to-pardis-primary/30 py-32">
      <Container>
        <Subheading dark>تعامل</Subheading>
        <Heading as="h3" dark className="mt-2 max-w-3xl">
          ابزارهای شما برای تعامل و پشتیبانی.
        </Heading>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <BentoCard
            dark
            eyebrow="پشتیبانی"
            title="پشتیبانی تخصصی در طول مسیر"
            description="در طول مسیر یادگیری، پشتیبان‌های متخصص همراه شما خواهند بود تا به سوالات شما پاسخ دهند و چالش‌های شما را در پروژه‌ها برطرف کنند."
            graphic={
              <div className="h-80 bg-[url(/screenshots/networking.png)] bg-[size:851px_344px] bg-no-repeat" />
            }
            fade={['top']}
            className="max-lg:rounded-t-4xl lg:col-span-4 lg:rounded-tl-4xl"
          />
          <BentoCard
            dark
            eyebrow="یکپارچگی"
            title="همگام با ابزارهای شما"
            description="چه در VS Code یا Google Colab، دستیار پردیس همراه شماست تا هیچ ابزاری از اکوسیستم یادگیری شما جا نماند."
            graphic={<LogoTimeline />}
            className="z-10 overflow-visible! lg:col-span-2 lg:rounded-tr-4xl"
          />
          <BentoCard
            dark
            eyebrow="جلسات"
            title="زمان‌بندی هوشمند"
            description="به صورت خودکار جلسات مشاوره و رفع اشکال (Mentorship) را با اساتید در تقویم خود تنظیم کنید."
            graphic={<LinkedAvatars />}
            className="lg:col-span-2 lg:rounded-bl-4xl"
          />
          <BentoCard
            dark
            eyebrow="تعامل"
            title="تبدیل به یک متخصص شوید"
            description="هوش مصنوعی پردیس به شما در نوشتن مقالات فنی، به اشتراک‌گذاری پروژه‌ها و ساخت یک برند شخصی قوی کمک می‌کند."
            graphic={
              <div className="h-80 bg-[url(/screenshots/engagement.png)] bg-[size:851px_344px] bg-no-repeat" />
            }
            fade={['top']}
            className="max-lg:rounded-b-4xl lg:col-span-4 lg:rounded-br-4xl"
          />
        </div>
      </Container>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <Container className="mt-10">
          <LogoCloud />
        </Container>
        <div className="bg-linear-to-b from-white from-40% to-pardis-primary-50 py-32">
          <FeatureSection />
          <BentoSection />
        </div>
        <DarkBentoSection />
      </main>
      <Testimonials />
      <Footer />
    </div>
  )
}
