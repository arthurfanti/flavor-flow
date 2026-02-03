import Icon from "@/components/Icon";
import { Link } from "@/navigation";

export default function LandingFooter() {
    return (
        <footer className="px-5 py-20 border-t border-white/5 flex flex-col gap-12 bg-background pb-48">
            <div className="flex flex-col gap-6">
                <span className="font-landing-display font-black text-4xl italic tracking-tighter">
                    FF.
                </span>
                <p className="text-neutral-400 text-sm max-w-[200px]">
                    The modern editorial experience for the digital chef.
                </p>
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex gap-10 text-neutral-400">
                    <Link href="#" aria-label="Instagram">
                        <Icon name="photo_camera" className="text-2xl" />
                    </Link>
                    <Link href="#" aria-label="Flutter">
                        <Icon name="flutter_dash" className="text-2xl" />
                    </Link>
                    <Link href="#" aria-label="Music">
                        <Icon name="music_note" className="text-2xl" />
                    </Link>
                </div>
                <p className="text-neutral-500/40 text-[10px] uppercase tracking-widest">
                    © 2024 Flavor Flow. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
