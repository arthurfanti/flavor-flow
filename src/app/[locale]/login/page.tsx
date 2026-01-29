"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { toast } from "sonner";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

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
        router.push("/");
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {isSignUp ? t("signUp") : t("signIn")}
          </h2>
          <p className="text-sm text-gray-500">
            {isSignUp 
              ? t("signUpDescription") 
              : t("signInDescription")}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 ml-1">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 ml-1">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3.5 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignUp ? t("signingUp") : t("signingIn")}
              </span>
            ) : (
              isSignUp ? t("signUp") : t("signIn")
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-sm text-blue-600 hover:underline focus:outline-none"
          >
            {isSignUp 
              ? t("alreadyHaveAccount") 
              : t("dontHaveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}
