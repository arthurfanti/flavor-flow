export default function LandingHero() {
    return (
        <header className="pt-40 pb-32 px-5 flex flex-col gap-12">
            <div className="flex flex-col gap-2">
                <span className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase">
                    AI Powered Kitchen
                </span>
                <h1 className="text-[7.5rem] leading-[0.8] mb-8 font-landing-display font-bold uppercase tracking-tighter italic">
                    From <br />
                    Screen <br />
                    <span className="text-brand-primary">To Table.</span>
                </h1>
            </div>
            <div className="pl-2 border-l-2 border-brand-primary">
                <p className="text-neutral-400 text-xl font-light leading-relaxed max-w-[280px]">
                    Turn your favorite food videos into cookable recipes instantly with
                    our AI-powered kitchen companion.
                </p>
            </div>
        </header>
    );
}
