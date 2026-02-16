'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { PWAInstall, usePWAInstall, type PWAInstallHandle } from '@/components/PWAInstall';
import { Download, CheckCircle } from 'lucide-react';

export default function LandingCTA() {
  const pwaRef = useRef<PWAInstallHandle>(null);
  const { isInstallAvailable, isUnderStandaloneMode, showDialog } = usePWAInstall(pwaRef);
  const [isIOS, setIsIOS] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const appleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(appleDevice);
  }, []);

  const handleInstallClick = () => {
    showDialog();
  };

  const showInstallButton = mounted && (isInstallAvailable || isIOS);
  const isInstalled = mounted && isUnderStandaloneMode;

  return (
    <section className="py-40 flex flex-col items-center gap-12 overflow-hidden w-full">
      <PWAInstall
        ref={pwaRef}
        tintColor="#e05d44"
      />

      <div className="px-5 w-full">
        <h2 className="text-7xl leading-[0.85] italic font-landing-display uppercase tracking-tighter text-center">
          Elevate <br />
          Your Home <br />
          Cooking <br />
          <span className="text-brand-primary">Today.</span>
        </h2>

        <div className="mt-12 flex justify-center">
          {isInstalled ? (
            <div className="flex items-center gap-3 text-brand-secondary">
              <CheckCircle className="w-6 h-6" />
              <span className="font-landing-display italic text-xl">App Installed</span>
            </div>
          ) : showInstallButton ? (
            <button
              onClick={handleInstallClick}
              className="landing-liquid-glass px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform duration-300 cursor-pointer group"
            >
              <Download className="w-6 h-6 text-brand-primary group-hover:animate-bounce" />
              <span className="font-landing-display italic text-xl">
                Install App
              </span>
            </button>
          ) : (
            <Link
              href="/app"
              className="landing-liquid-glass px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform duration-300"
            >
              <span className="font-landing-display italic text-xl">
                Get Started
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="w-full relative overflow-hidden py-4 border-y border-white/5">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          <span className="text-neutral-400 text-2xl font-light italic mx-6">
            Join thousands of home chefs using Flavor Flow.
          </span>
          <span className="text-brand-primary text-2xl font-landing-display mx-6">
            •
          </span>
          <span className="text-neutral-400 text-2xl font-light italic mx-6">
            Bridge the gap between inspiration and dinner.
          </span>
          <span className="text-brand-primary text-2xl font-landing-display mx-6">
            •
          </span>
          <span className="text-neutral-400 text-2xl font-light italic mx-6">
            Join thousands of home chefs using Flavor Flow.
          </span>
          <span className="text-brand-primary text-2xl font-landing-display mx-6">
            •
          </span>
          <span className="text-neutral-400 text-2xl font-light italic mx-6">
            Bridge the gap between inspiration and dinner.
          </span>
          <span className="text-brand-primary text-2xl font-landing-display mx-6">
            •
          </span>
        </div>
      </div>
    </section>
  );
}
