"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

interface AuthResult {
  error?: string;
}

export async function signUp(formData: FormData): Promise<AuthResult | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const supabase = await createClient();
  const locale = await getLocale();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : "http://localhost:3000"}/${locale}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect({ href: "/verify-email", locale });
}

export async function signIn(formData: FormData): Promise<AuthResult | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();
  const locale = await getLocale();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

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
      redirect({ href: "/complete-profile", locale });
    }
  }

  redirect({ href: "/evaluate", locale });
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  const locale = await getLocale();
  await supabase.auth.signOut();
  redirect({ href: "/", locale });
}
