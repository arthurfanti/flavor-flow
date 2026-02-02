import Icon from "@/components/Icon";
import Link from "next/link";

export default function LandingFloatingButton() {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-40px)] max-w-md">
            <Link
                href="/app"
                className="landing-liquid-glass w-full py-6 px-8 rounded-full flex items-center justify-between group transition-all duration-500 hover:scale-[1.02] active:scale-95"
            >
                <span className="font-landing-display italic text-2xl text-white">
                    Start Cooking
                </span>
                <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center">
                    <Icon name="arrow_outward" className="text-white text-2xl" />
                </div>
            </Link>
        </div>
    );
}
