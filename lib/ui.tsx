import Image from "next/image";
import { altOf, type Dict } from "@/lib/i18n";

export const M = (cat: string, name: string) => `/media/${cat}/${name}.jpg`;

/** Photo de public/media avec son texte alternatif dans la langue de la page */
export function Photo({ src, d, sizes, className = "", priority = false, position }: { src: string; d: Dict; sizes: string; className?: string; priority?: boolean; position?: string }) {
  return (
    <div className={`shine relative overflow-hidden bg-sand ${className}`}>
      <Image src={src} alt={altOf(d, src)} fill sizes={sizes} priority={priority} className="object-cover" style={position ? { objectPosition: position } : undefined} />
    </div>
  );
}
