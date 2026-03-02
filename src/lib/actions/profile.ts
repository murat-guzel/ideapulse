"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

interface ProfileResult {
  error?: string;
}

export async function completeProfile(formData: FormData): Promise<ProfileResult | void> {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const industry = formData.get("industry") as string;
  const experienceLevel = formData.get("experience_level") as string;
  const interests = formData.getAll("interests") as string[];

  if (!fullName || !role || !industry || !experienceLevel) {
    return { error: "All fields are required" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      role,
      industry,
      experience_level: experienceLevel,
      interests,
      locale,
      is_profile_complete: true,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect({ href: "/evaluate", locale });
}
