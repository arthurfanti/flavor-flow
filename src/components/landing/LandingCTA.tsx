export default function LandingCTA() {
    return (
        <section className="py-40 flex flex-col items-start gap-12 overflow-hidden w-full">
            <div className="px-5">
                <h2 className="text-7xl leading-[0.85] italic font-landing-display uppercase tracking-tighter">
                    Elevate <br />
                    Your Home <br />
                    Cooking <br />
                    <span className="text-brand-primary">Today.</span>
                </h2>
            </div>

            {/* Marquee */}
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
