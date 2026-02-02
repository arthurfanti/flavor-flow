const features = [
    {
        number: "01",
        title: "AI Extraction",
        description:
            "Watch it, then cook it. Our AI extracts ingredients and steps from any video instantly. No transcription needed.",
    },
    {
        number: "02",
        title: "Smart Pantry",
        description:
            "We know what you have. We suggest what to make. Reduce waste and discover new favorites.",
    },
    {
        number: "03",
        title: "Meal Planner",
        description:
            "Organize your culinary week with drag-and-drop ease. Auto-generated shopping lists included.",
    },
];

export default function LandingFeatures() {
    return (
        <section className="px-5 py-24 flex flex-col gap-20">
            <div className="border-t border-white/10 pt-8">
                <h2 className="text-6xl italic mb-6 font-landing-display uppercase tracking-tighter">
                    The Features
                </h2>
                <p className="text-neutral-400 text-sm max-w-[240px]">
                    Experience the culinary magic with tools designed for the modern chef.
                </p>
            </div>
            <div className="flex flex-col gap-24">
                {features.map((feature) => (
                    <div key={feature.number} className="flex flex-col gap-6">
                        <span className="font-landing-display text-brand-primary text-4xl italic">
                            {feature.number}
                        </span>
                        <h3 className="text-4xl font-landing-display uppercase tracking-tighter italic">
                            {feature.title}
                        </h3>
                        <p className="text-neutral-400 text-lg font-light leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
