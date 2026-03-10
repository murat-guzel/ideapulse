import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LandingNav } from "@/components/landing/landing-nav";
import { Logo } from "@/components/ui/logo";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const tc = await getTranslations("common");

  return (
    <main className="flex min-h-screen flex-col">
      <LandingNav />

      {/* ===== HERO ===== */}
      <section className="hero-gradient relative overflow-hidden pt-16">
        {/* Glow overlay */}
        <div className="hero-glow pointer-events-none absolute inset-0" />

        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {t("badge")}
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-delay-1 mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {t("heroLine1")}
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                {t("heroLine2")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-delay-2 mx-auto mb-10 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
              {t("heroSub")}
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-delay-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-500/30"
              >
                {t("ctaPrimary")}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                {t("ctaSecondary")}
              </a>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="animate-fade-in-delay-3 mx-auto mt-16 max-w-4xl sm:mt-20">
            <div className="rounded-xl border border-white/10 bg-white/5 p-1.5 shadow-2xl backdrop-blur-sm">
              <div className="rounded-lg bg-dark-card p-6">
                {/* Mock browser bar */}
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                  <div className="ml-4 h-6 flex-1 rounded-md bg-white/5" />
                </div>

                {/* Mock dashboard content */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Score cards */}
                  <div className="rounded-lg bg-white/5 p-4">
                    <div className="mb-1 text-xs text-gray-500">Problem Intensity</div>
                    <div className="text-2xl font-bold text-brand-400">7.8</div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-[78%] rounded-full bg-brand-500" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-4">
                    <div className="mb-1 text-xs text-gray-500">Payment Intent</div>
                    <div className="text-2xl font-bold text-brand-400">6.5</div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-[65%] rounded-full bg-brand-500" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-4">
                    <div className="mb-1 text-xs text-gray-500">Differentiation</div>
                    <div className="text-2xl font-bold text-brand-400">8.2</div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-[82%] rounded-full bg-brand-500" />
                    </div>
                  </div>
                </div>

                {/* Mock chart area */}
                <div className="mt-4 flex gap-4">
                  <div className="flex-1 rounded-lg bg-white/5 p-4">
                    <div className="mb-3 text-xs text-gray-500">Feedback Themes</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-400" />
                        <div className="h-2.5 w-3/4 rounded bg-white/10" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-300" />
                        <div className="h-2.5 w-1/2 rounded bg-white/10" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-200" />
                        <div className="h-2.5 w-2/3 rounded bg-white/10" />
                      </div>
                    </div>
                  </div>
                  <div className="w-40 rounded-lg bg-white/5 p-4">
                    <div className="mb-3 text-xs text-gray-500">Signal</div>
                    <div className="text-lg font-bold text-brand-400">Strong</div>
                    <div className="mt-1 text-xs text-gray-500">15 evaluations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {([1, 2, 3, 4] as const).map((i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {t(`stat${i}Value`)}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {t(`stat${i}Label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="bg-gray-50 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t("howTitle")}
            </h2>
            <p className="text-base text-gray-500 sm:text-lg">{t("howSubtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {([1, 2, 3] as const).map((step) => (
              <div key={step} className="step-card group relative rounded-2xl p-8">
                {/* Step number */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-lg font-extrabold text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  {step}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {t(`step${step}Title`)}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {t(`step${step}Desc`)}
                </p>

                {/* Connector line (except last) */}
                {step < 3 && (
                  <div className="absolute top-16 -right-4 hidden h-0.5 w-8 bg-brand-200 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-white px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t("featTitle")}
            </h2>
            <p className="text-base text-gray-500 sm:text-lg">{t("featSubtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Structured Scoring */}
            <div className="feature-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{t("feat1Title")}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{t("feat1Desc")}</p>
            </div>

            {/* Feature 2: AI Summaries */}
            <div className="feature-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{t("feat2Title")}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{t("feat2Desc")}</p>
            </div>

            {/* Feature 3: Weighted Signals */}
            <div className="feature-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{t("feat3Title")}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{t("feat3Desc")}</p>
            </div>

            {/* Feature 4: Dashboard */}
            <div className="feature-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{t("feat4Title")}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{t("feat4Desc")}</p>
            </div>

            {/* Feature 5: Community */}
            <div className="feature-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{t("feat5Title")}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{t("feat5Desc")}</p>
            </div>

            {/* Feature 6: 48h Lifecycle */}
            <div className="feature-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{t("feat6Title")}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{t("feat6Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="cta-gradient px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
            {t("ctaSub")}
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-900 shadow-lg transition-all hover:shadow-xl"
          >
            {t("ctaButton")}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-100 bg-white px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="mb-4">
                <Logo textClassName="text-gray-900" />
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                {t("footerDesc")}
              </p>
            </div>

            {/* Product links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">
                {t("footerProduct")}
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <Link href="/evaluate" className="transition-colors hover:text-brand-600">
                    {tc("appName")}
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="transition-colors hover:text-brand-600">
                    {t("signup")}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="transition-colors hover:text-brand-600">
                    {t("login")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">
                {t("footerResources")}
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <span className="cursor-default">{t("footerBlog")}</span>
                </li>
                <li>
                  <span className="cursor-default">{t("footerDocs")}</span>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">
                {t("footerLegal")}
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <span className="cursor-default">{t("footerPrivacy")}</span>
                </li>
                <li>
                  <span className="cursor-default">{t("footerTerms")}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
            {tc("appName")} &copy; {new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
