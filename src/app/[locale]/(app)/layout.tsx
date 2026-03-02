import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  // Check profile completion
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_profile_complete")
    .eq("id", user.id)
    .single();

  if (profile && !profile.is_profile_complete) {
    redirect({ href: "/complete-profile", locale });
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={true} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
