import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Unwrap params synchronously for static rendering support
  const locale =
    typeof (params as unknown as { locale: string }).locale === "string"
      ? (params as unknown as { locale: string }).locale
      : "en";
  setRequestLocale(locale);
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="mb-2 text-sm font-semibold tracking-widest text-indigo-600 uppercase">
          {tc("appName")}
        </h1>
        <h2 className="mb-6 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {t("hero")}
        </h2>
        <p className="mb-10 max-w-lg text-lg text-gray-600">{t("heroSub")}</p>
        <Link
          href="/evaluate"
          className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          {t("cta")}
        </Link>
      </section>

      {/* How it works */}
      <section className="border-t bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-12 text-center text-2xl font-bold">
            {t("howTitle")}
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {([1, 2, 3] as const).map((step) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                  {step}
                </div>
                <h4 className="mb-2 font-semibold">
                  {t(`step${step}Title`)}
                </h4>
                <p className="text-sm text-gray-600">
                  {t(`step${step}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why IdeaPulse */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <h3 className="mb-8 text-center text-2xl font-bold">
            {t("whyTitle")}
          </h3>
          <ul className="space-y-4">
            {([1, 2, 3, 4] as const).map((i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                <span className="text-gray-700">{t(`why${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        {tc("appName")} &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
