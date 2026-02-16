"use client";

import { useRef, useState, useEffect } from "react";
import {
  PWAInstall,
  usePWAInstall,
  type PWAInstallHandle,
} from "@/components/PWAInstall";

export default function LandingPage() {
  const pwaRef = useRef<PWAInstallHandle>(null);
  const { isInstallAvailable, isUnderStandaloneMode, showDialog } =
    usePWAInstall(pwaRef);
  const [isIOS, setIsIOS] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const appleDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(appleDevice);
  }, []);

  const handleInstallClick = () => {
    showDialog();
  };

  const showInstallButton = mounted && (isInstallAvailable || isIOS);
  const isInstalled = mounted && isUnderStandaloneMode;

  return (
    <div className="relative bg-[#1A1816] text-white h-dvh w-dvw flex flex-col antialiased selection:bg-[#E05D44] selection:text-white overflow-hidden">
      <PWAInstall ref={pwaRef} tintColor="#e05d44" />

      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
          poster="https://lh3.googleusercontent.com/aida-public/AB6AXuDcsTU9DcwQ1TlanCpeaEHF2kLUMQ42n9cr6KAGbwETiij8B0ifSBplbaHTcICfpDi106z_Et04Kd6S1XXXEkRUh7x33NsPrYR0VAZJrwQZ8zwyEA-V66aLfE6Jq-EIKlH-l5PsD97rYH9KmhwEC74MMPVklfg0iRAaaJ7PCclJ25tUkbMC5grPkrD51as7h4e_2040LS67BjbnNafilPNB2wLwNoXuDz17GOET8acdhGhUgkbvJ6fsP1ONcMhXZDqA_BVTnRtZgE3Q"
        >
          <source src="/lp-awesome-video.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-transparent to-black/30" />
      </div>

      <main className="relative z-10 flex flex-col h-full justify-between items-center px-6 pt-12 pb-10 overflow-hidden">
        <div className="w-full flex justify-center opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
          <span className="text-white/60 text-xs font-sans tracking-[0.2em] uppercase font-semibold drop-shadow-md">
            Flavor Flow
          </span>
        </div>

        <div className="flex flex-col items-center w-full max-w-md text-center space-y-8 mb-4">
          <div className="space-y-4">
            <h1 className="text-white font-serif font-bold text-[42px] leading-[1.1] tracking-tight drop-shadow-lg">
              Turn Videos
              <br />
              into <i className="text-[#E05D44]">Dinner</i>
            </h1>
            <p className="text-white/70 font-serif text-base font-normal leading-tight max-w-[280px] mx-auto drop-shadow-md">
              Paste a TikTok, Instagram or YoutTube link. Get a shopping list.
              Cook.
            </p>
          </div>

          <div className="w-full pt-4">
            {isInstalled ? (
              <div className="w-full h-14 rounded-full flex items-center justify-center bg-white/10">
                <span className="font-sans font-semibold text-white/80 text-lg">
                  App Installed
                </span>
              </div>
            ) : showInstallButton ? (
              <button
                onClick={handleInstallClick}
                className="group relative w-full h-14 bg-[#E05D44] rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_rgba(224,93,68,0.4)] active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="font-sans font-semibold text-white text-lg tracking-wide z-10 flex items-center gap-2">
                  Get the App
                </span>
              </button>
            ) : (
              <button className="group relative w-full h-14 bg-[#E05D44] rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_rgba(224,93,68,0.4)] active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="font-sans font-semibold text-white text-lg tracking-wide z-10 flex items-center gap-2">
                  Get the App
                </span>
              </button>
            )}
            <p className="mt-4 text-white/50 text-xs font-sans">
              iOS &amp; Android Compatible
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
