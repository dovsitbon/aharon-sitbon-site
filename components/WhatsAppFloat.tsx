import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/booking";

export function WhatsAppFloat({ label, message }: { label: string; message: string }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="wa-float fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-night shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] transition-[background-color,bottom] duration-500 hover:bg-parchment md:end-8 md:bottom-8"
    >
      <WhatsAppIcon />
    </a>
  );
}
