import * as React from "react";

import { renderAppleEmojiText } from "@/components/birthday/Emoji";
import { Reveal, WordReveal } from "@/components/birthday/Reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function imageSrc(index: number) {
  return `/images/diya-${String(index).padStart(2, "0")}.jpg`;
}

export function ChapterOneFannedGallery({
  eyebrow,
  title,
  blurb,
  images,
  enabled = true,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  images: number[];
  enabled?: boolean;
}) {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-ink py-16 sm:py-20">
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[clamp(0.76rem,2.5vw,0.65rem)] uppercase tracking-[0.38em] text-gold">{eyebrow}</p>
        </Reveal>
        <h2 className="mt-5 font-display text-[clamp(2.65rem,8vw,2.25rem)] tracking-tight text-cream sm:text-6xl">
          <WordReveal text={title} />
        </h2>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-[clamp(1.125rem,4vw,1rem)] font-light leading-relaxed text-cream/70">
            {renderAppleEmojiText(blurb)}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 sm:mt-16">
        <Carousel className="w-full max-w-5xl mx-auto" opts={{ align: "center", loop: true }}>
          <CarouselContent>
            {images.map((index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-2 sm:p-3">
                  <div className="overflow-hidden rounded-2xl bg-card/80 shadow-soft backdrop-blur-sm aspect-[9/16]">
                    <img
                      src={imageSrc(index)}
                      alt={`A photo of Diya, number ${index}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:-left-12" />
          <CarouselNext className="right-2 sm:-right-12" />
        </Carousel>
        <div className="mt-6 flex items-center justify-center gap-2 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-cream/40">
            Swipe to browse
          </p>
          <svg className="h-5 w-5 text-cream/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
