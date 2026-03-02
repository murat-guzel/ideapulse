import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = request.url.match(/\/(\w{2})\/auth\/callback/)?.[1] || "en";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if profile is complete
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_profile_complete")
          .eq("id", user.id)
          .single();

        if (profile && !profile.is_profile_complete) {
          return NextResponse.redirect(
            `${origin}/${locale}/complete-profile`
          );
        }
      }

      return NextResponse.redirect(`${origin}/${locale}/evaluate`);
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${origin}/${locale}/login`);
}
