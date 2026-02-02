import Icon from "@/components/Icon";

const guideSteps = [
    {
        number: "01",
        icon: "ios_share",
        title: "Step 01",
        heading: "Tap the Share Icon",
        description: "Locate the square icon with an arrow in your Safari toolbar.",
    },
    {
        number: "02",
        icon: "add_box",
        title: "Step 02",
        heading: "Add to Home Screen",
        description:
            'Scroll down the menu options and select "Add to Home Screen".',
    },
];

export default function LandingGuide() {
    return (
        <section className="relative px-5 py-32 bg-zinc-50 text-background -mx-5 px-10 overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    alt="Marble texture background"
                    className="w-full h-full object-cover opacity-[0.15] mix-blend-multiply"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDLY-JJ3XK26qTBAHvymGNizvn3F4ukdD_wwm1p0y9z1I_TapwIl8gXNZcaz_ZfSMw6-hu7RAgaifXLUb4q-i4uyimqp4bNWWBZ8ur0X166F56Ij_3Wj_m64uk8shp5OS4lq5TwjYhK1y599FHILLZKrTxe8c9AMLMO_6y_NY6BUP_zHlsdXLV-V70b2VI2dfNfjovbjM2cyY-zhose1RQK2GgLzPpkLDrDXaFyxkhEk6qyt1Lz3MkztmiD9jVySB-1p6opYk64bU"
                />
            </div>

            {/* Header */}
            <div className="mb-20 relative z-10">
                <span className="text-brand-primary text-xs font-bold tracking-[0.3em] uppercase">
                    The Guide
                </span>
                <h2 className="text-6xl mt-4 italic font-landing-display uppercase tracking-tighter text-background">
                    Installation Made Simple
                </h2>
                <p className="mt-8 text-zinc-500 font-light text-lg">
                    Flavor Flow is a{" "}
                    <strong className="text-background font-medium">
                        Progressive Web App (PWA)
                    </strong>
                    . Get the full native experience directly from your browser.
                </p>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-12 relative z-10">
                {guideSteps.map((step) => (
                    <div key={step.number} className="relative pl-4">
                        <div className="landing-step-number-guide absolute -top-12 -left-6 pointer-events-none select-none font-landing-display italic">
                            {step.number}
                        </div>
                        <div className="relative z-10 flex flex-col gap-4 pt-4 border-l border-brand-primary/20 pl-6">
                            <div className="flex items-center gap-4">
                                <Icon name={step.icon} className="text-3xl text-brand-primary" />
                                <h3 className="text-3xl font-landing-display uppercase tracking-tighter italic text-background">
                                    {step.title}
                                </h3>
                            </div>
                            <h4 className="text-xl font-landing-display italic text-zinc-800">
                                {step.heading}
                            </h4>
                            <p className="text-zinc-600 font-light leading-relaxed text-base">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
