import Icon from "@/components/Icon";

export default function LandingNavbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
            <div className="max-w-md mx-auto px-5 h-20 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="font-landing-display font-black text-2xl italic tracking-tighter">
                        FF.
                    </span>
                </div>
                <Icon name="menu" className="text-neutral-400 font-light text-2xl" />
            </div>
        </nav>
    );
}
