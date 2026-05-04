// Hero canônico — primeiro viewport sempre cabe (100dvh mobile, 80vh desktop).
// Headline usa clamp() via classe .h1 do globals.css. NUNCA text-[15vw].
// Foto à direita ocupa 5/12 colunas em desktop, max 35vh em mobile.

import Image from "next/image";
import Link from "next/link";

export type HeroProps = {
  eyebrow?: string;
  headline: string;
  italic?: string;       // parte da headline em itálico (accent)
  sub: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  image?: { src: string; alt: string; width: number; height: number };
};

export function Hero({ eyebrow, headline, italic, sub, ctaPrimary, ctaSecondary, image }: HeroProps) {
  return (
    <section className="hero container-x py-12 md:py-20">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className={image ? "md:col-span-7 order-2 md:order-1" : "md:col-span-12"}>
          {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
          <h1 className="mb-6">
            {headline}
            {italic && (
              <>
                {" "}
                <span className="italic" style={{ color: "var(--color-accent)" }}>
                  {italic}
                </span>
              </>
            )}
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "var(--color-muted)" }}>
            {sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={ctaPrimary.href} className="btn-accent">
              {ctaPrimary.label}
            </Link>
            {ctaSecondary && (
              <Link href={ctaSecondary.href} className="btn-ghost">
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>
        {image && (
          <div className="md:col-span-5 order-1 md:order-2 max-h-[35vh] md:max-h-none">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover w-full h-full"
              style={{ aspectRatio: "4 / 5" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
