"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { toast } from "sonner";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (!error) {
          toast.success(t("checkEmail"));
          setIsSignUp(false);
        } else {
          setError(error.message);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error) {
          toast.success(t("welcomeBack"));

          // Fetch user profile to get preferred locale
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            try {
              // Initialize repository locally to avoid hook dependency issues in this async handler
              const { SupabaseProfileRepository } = await import('@/lib/repositories/SupabaseProfileRepository');
              const profileRepo = new SupabaseProfileRepository(supabase);
              const profile = await profileRepo.getProfile(user.id);
              const preferredLocale = profile?.preferred_locale || 'en';

              router.push("/app", { locale: preferredLocale });
            } catch (e) {
              console.error("Failed to fetch profile settings, falling back to default", e);
              router.push("/app");
            }
          } else {
            router.push("/app");
          }
        } else {
          setError(error.message);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-brand-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-brand-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-12">
          <span className="font-landing-display font-black text-5xl italic tracking-tighter text-white mb-8 block">
            FF.
          </span>
          <h1 className="text-5xl font-landing-display uppercase italic tracking-tighter text-white mb-4">
            {isSignUp ? t("signUp") : t("signIn")}
          </h1>
          <p className="text-neutral-400 font-light text-lg">
            {isSignUp ? t("signUpDescription") : t("signInDescription")}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-2xl animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 ml-4">
                {t("email")}
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t("emailPlaceholder")}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-primary transition-colors pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600">
                  <Icon name="mail" className="text-xl" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 ml-4">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-primary transition-colors pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600">
                  <Icon name="lock" className="text-xl" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-landing-display italic text-2xl uppercase tracking-tighter transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? t("signUp") : t("signIn")}
                  <Icon name="arrow_forward" className="text-xl" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-neutral-400 hover:text-white transition-colors text-sm font-light px-4 py-2"
            >
              {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}
            </button>
          </div>
        </div>

        {/* Back to landing */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-600 hover:text-brand-primary transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
