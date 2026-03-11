import { useTranslations } from "next-intl";

export function EmptyState() {
  const t = useTranslations("evaluate");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm shadow-gray-950/[0.03]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <p className="text-lg font-semibold text-gray-900">{t("noMoreIdeas")}</p>
      <p className="mt-1.5 text-sm text-gray-500">{t("noMoreIdeasDesc")}</p>
    </div>
  );
}
