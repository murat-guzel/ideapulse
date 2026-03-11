"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/lib/actions/waitlist";
import { cn } from "@/lib/utils";

type WaitlistState = {
  error?: string;
  success?: boolean;
  alreadyJoined?: boolean;
};

interface WaitlistFormProps {
  variant?: "hero" | "cta";
  placeholder?: string;
  buttonText?: string;
  successText?: string;
}

export function WaitlistForm({
  variant = "hero",
  placeholder = "Enter your email",
  buttonText = "Get Early Access",
  successText = "You're on the list!",
}: WaitlistFormProps) {
  const [state, formAction, isPending] = useActionState<WaitlistState, FormData>(
    async (_prev, formData) => {
      return await joinWaitlist(formData);
    },
    {}
  );

  if (state.success) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-6 py-3.5",
          variant === "hero"
            ? "bg-white/10 border border-white/20 text-white"
            : "bg-brand-50 border border-brand-100 text-brand-700"
        )}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">
          {state.alreadyJoined ? "You're already on the list!" : successText}
        </span>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-md">
      <div
        className={cn(
          "flex items-center rounded-full p-1.5 transition-all",
          variant === "hero"
            ? "bg-white/10 border border-white/20 focus-within:border-white/40 focus-within:bg-white/15"
            : "bg-white border border-gray-200 shadow-sm focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100"
        )}
      >
        <input
          type="email"
          name="email"
          required
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:opacity-60",
            variant === "hero"
              ? "text-white placeholder:text-white/50"
              : "text-gray-900 placeholder:text-gray-400"
          )}
        />
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-70",
            variant === "hero"
              ? "bg-white text-gray-900 hover:bg-gray-100 active:scale-[0.98]"
              : "bg-brand-600 text-white hover:bg-brand-500 active:scale-[0.98]"
          )}
        >
          {isPending ? (
            <svg className="h-4 w-4 animate-spin mx-auto" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            buttonText
          )}
        </button>
      </div>
      {state.error && (
        <p className={cn(
          "mt-2 text-xs",
          variant === "hero" ? "text-red-300" : "text-red-500"
        )}>
          {state.error}
        </p>
      )}
    </form>
  );
}
