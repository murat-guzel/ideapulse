"use server";

import { createClient } from "@/lib/supabase/server";

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("waitlist")
    .insert({ email: email.toLowerCase().trim(), source: "landing" });

  if (error) {
    if (error.code === "23505") {
      // Unique constraint — already on the list
      return { success: true, alreadyJoined: true };
    }
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
