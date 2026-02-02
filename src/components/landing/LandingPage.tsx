import {
  LandingNavbar,
  LandingHero,
  LandingFeatures,
  LandingGuide,
  LandingCTA,
  LandingFooter,
  LandingFloatingButton,
} from "./";

export default function LandingPage() {
  return (
    <div
      className="relative overflow-x-hidden bg-background text-white tracking-[0.05em]"
      style={{ minHeight: "max(884px, 100dvh)" }}
    >
      <div className="landing-grid-line left-5" />
      <div className="landing-grid-line right-5" />

      <LandingFloatingButton />
      <LandingNavbar />

      <main className="w-full max-w-md mx-auto relative z-10">
        <LandingHero />
        <LandingFeatures />
        <LandingGuide />
        <LandingCTA />
        <LandingFooter />
      </main>
    </div>
  );
}
