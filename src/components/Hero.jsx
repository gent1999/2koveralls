import { Link } from 'react-router-dom';
import heroBanner from '../assets/hero_banner.webp';

// The banner already contains the "RAP HAS STATS NOW." headline (left) and the
// rapper/crowd visual (right) — this component only adds the live overlay:
// supporting copy + CTAs under the baked-in headline, and the real featured
// Overall card floating in the banner's intentionally empty center.
export default function Hero({ hero, isTopRanked }) {
  const viewRatingHref = hero ? `/overalls/${hero.slug}` : '/overalls';
  const readWhyHref = hero ? `/overalls/${hero.slug}#why` : '/overalls';

  return (
    <section className="border-b border-ink-line">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="relative md:aspect-[3/1]">
          <img
            src={heroBanner}
            alt="Rap Has Stats Now — 2K Overalls"
            width={2172}
            height={724}
            loading="eager"
            fetchPriority="high"
            className="w-full md:absolute md:inset-0 md:h-full md:w-full md:object-cover"
          />

          {/* Supporting copy + CTAs. The banner's baked-in headline (incl. the
              underline flourish) ends at ~79% of the image height — this block
              is anchored from the top at 82% so it only grows downward and can
              never climb back up into the headline, at any breakpoint. */}
          <div className="mt-6 md:absolute md:left-[4%] md:top-[83%] md:mt-0 md:w-[27%]">
            <p className="text-sm text-bone-dim drop-shadow-sm md:text-[10px] md:leading-tight lg:text-sm lg:leading-normal">
              Objective ratings. Real debates. The culture's board.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 md:mt-1.5 md:gap-1.5 lg:mt-3 lg:gap-3">
              <Link
                to={viewRatingHref}
                className="border border-brand bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-transparent hover:text-brand md:px-2.5 md:py-1 md:text-[9px] lg:px-5 lg:py-2.5 lg:text-sm"
              >
                View Rating
              </Link>
              <Link
                to={readWhyHref}
                className="border border-ink-line bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-bone transition-colors hover:border-brand hover:text-brand md:px-2.5 md:py-1 md:text-[9px] lg:px-5 lg:py-2.5 lg:text-sm"
              >
                Read Why
              </Link>
            </div>
          </div>

          {/* Featured Overall card, floating in the banner's open center */}
          {hero && (
            <div className="mt-8 flex flex-col items-center md:absolute md:left-[33%] md:top-1/2 md:mt-0 md:w-[34%] md:-translate-y-1/2">
              <span className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand drop-shadow-sm md:mb-3">
                {isTopRanked ? 'Current #1' : 'Featured Overall'}
              </span>
              <Link
                to={`/overalls/${hero.slug}`}
                className="group relative block aspect-[3/4] w-44 flex-shrink-0 overflow-hidden border border-brand bg-ink-soft shadow-[0_0_34px_-8px_rgba(249,115,22,0.5)] transition-transform duration-300 hover:-translate-y-1 sm:w-48 md:w-36 lg:w-44 xl:w-52"
              >
                <img
                  src={hero.image_url}
                  alt={hero.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    objectPosition: `${hero.hero_crop_x ?? hero.crop_x ?? 50}% ${hero.hero_crop_y ?? hero.crop_y ?? 50}%`,
                    transform: `scale(${(hero.hero_crop_zoom ?? hero.crop_zoom ?? 100) / 100})`,
                  }}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
