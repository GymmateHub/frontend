import clsx from "clsx";
import lockupLight from "../../assets/brand/gymmatehub-lockup.svg";
import lockupDark from "../../assets/brand/gymmatehub-lockup-dark.svg";
import lockupWhite from "../../assets/brand/gymmatehub-lockup-white.svg";
import markBrand from "../../assets/brand/gymmatehub-mark-brand.svg";
import markSmallBrand from "../../assets/brand/gymmatehub-mark-small-brand.svg";
import markDark from "../../assets/brand/gymmatehub-mark-dark.svg";
import markSmallDark from "../../assets/brand/gymmatehub-mark-small-dark.svg";
import markWhite from "../../assets/brand/gymmatehub-mark-white.svg";
import markSmallWhite from "../../assets/brand/gymmatehub-mark-small-white.svg";

/**
 * GymMateHub brand marks (Kettle Gm identity).
 *
 * The SVGs live in `src/assets/brand/` (imported, so builds get hashed URLs)
 * and come from the brand asset pack; the source of truth is the Figma file
 * "GymMateHub — Logo & Brand Identity". The `-dark` files are the brand rule
 * "blue 400 for the mark on dark" applied to the pack's lockup and marks.
 * Use these components instead of referencing the files directly so the
 * light/dark swap and the small-size rule stay in one place.
 */

const BRAND_NAME = "GymMateHub";

/**
 * - `light`: brand-blue mark and ink wordmark, for light backgrounds.
 * - `dark`: blue-400 mark and white wordmark, for dark UI surfaces.
 * - `white`: all white, for brand-blue or brand-950 backgrounds.
 * - `auto`: `light`, switching to `dark` when the `.dark` theme is on.
 */
export type BrandTone = "auto" | "light" | "dark" | "white";

const LOCKUP: Record<Exclude<BrandTone, "auto">, string> = {
  light: lockupLight,
  dark: lockupDark,
  white: lockupWhite,
};

const MARK: Record<Exclude<BrandTone, "auto">, { full: string; small: string }> = {
  light: { full: markBrand, small: markSmallBrand },
  dark: { full: markDark, small: markSmallDark },
  white: { full: markWhite, small: markSmallWhite },
};

/** Below this many device pixels the full mark's "m" fills in; use the small cut. */
const SMALL_CUT_BELOW_DEVICE_PX = 40;

type LockupProps = {
  tone?: BrandTone;
  /** Size with a height utility, e.g. `h-8`. Keep it at least `h-6` (24px). */
  className?: string;
};

/** The Kettle Gm mark with the GymMateHub wordmark. */
export function BrandLockup({ tone = "auto", className = "h-8" }: LockupProps) {
  if (tone === "auto") {
    return (
      <>
        <img src={LOCKUP.light} alt={BRAND_NAME} className={clsx("w-auto dark:hidden", className)} />
        <img src={LOCKUP.dark} alt={BRAND_NAME} className={clsx("hidden w-auto dark:block", className)} />
      </>
    );
  }
  return <img src={LOCKUP[tone]} alt={BRAND_NAME} className={clsx("w-auto", className)} />;
}

type MarkProps = {
  tone?: BrandTone;
  /** Rendered height in CSS pixels. */
  size?: number;
  className?: string;
};

/**
 * The Kettle Gm mark on its own. Under 40 device pixels the browser is given
 * the small cut (kettlebell + G); on high-density screens it picks the full
 * mark once that renders at 40 device pixels or more.
 */
export function BrandMark({ tone = "auto", size = 32, className }: MarkProps) {
  const render = (t: Exclude<BrandTone, "auto">, extra?: string) => {
    const { full, small } = MARK[t];
    const sources =
      size >= SMALL_CUT_BELOW_DEVICE_PX
        ? { src: full }
        : size * 2 >= SMALL_CUT_BELOW_DEVICE_PX
          ? { src: small, srcSet: `${small} 1x, ${full} 2x` }
          : { src: small };
    return (
      <img
        {...sources}
        alt={BRAND_NAME}
        style={{ height: size, width: "auto" }}
        className={clsx(extra, className)}
      />
    );
  };

  if (tone === "auto") {
    return (
      <>
        {render("light", "dark:hidden")}
        {render("dark", "hidden dark:block")}
      </>
    );
  }
  return render(tone);
}
