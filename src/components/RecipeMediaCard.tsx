"use client";

import React from "react";
import { ViewTransition } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RecipeMediaCardProps {
  /** Background image URL. Falls back to a placeholder icon when absent. */
  imageSrc?: string;
  /** Primary text label. Single line, truncates with ellipsis. */
  title: string;
  /** Override the leading meta icon slot. Defaults to a Calendar outline. */
  metaIcon?: React.ReactNode;
  /** Override the meta label. Defaults to "planned meal". */
  metaText?: string;
  /** When supplied, the whole card renders as an anchor element. */
  href?: string;
  onClick?: () => void;
  className?: string;
  /**
   * `name` forwarded to React's <ViewTransition> on the background image.
   * Pass `recipe-hero-${id}` to enable shared-element transitions.
   */
  viewTransitionName?: string;
  /** Forwarded to the root element for aria purposes. */
  "aria-label"?: string;
}

const DefaultMetaIcon = (
  <Calendar
    className="w-4 h-4 flex-shrink-0"
    strokeWidth={1.75}
    aria-hidden="true"
  />
);

const PlaceholderIcon = (
  <svg
    className="w-10 h-10 text-white/20"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * RecipeMediaCard — unified 16:9 image card for recipe lists and planner queue.
 *
 * Aliases: MealCard, MediaInfoCard, PlannedMealMediaCard
 */
export function RecipeMediaCard({
  imageSrc,
  title,
  metaIcon = DefaultMetaIcon,
  metaText = "planned meal",
  href,
  onClick,
  className,
  viewTransitionName,
  "aria-label": ariaLabel,
}: RecipeMediaCardProps) {
  const content = (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-2xl bg-neutral-900",
        "focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-black",
        className,
      )}
    >
      {/* Background image */}
      {imageSrc ? (
        <ViewTransition name={viewTransitionName}>
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </ViewTransition>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
          {PlaceholderIcon}
        </div>
      )}

      {/* Bottom scrim overlay with glass blur effect */}
      <div
        className="absolute inset-0 pointer-events-none backdrop-blur-md backdrop-saturate-150 h-1/2 bottom-0 translate-y-full scale-[1.15] origin-top-left bg-gradient-to-br from-black/60 to-transparent"
        style={{
          maskImage: "linear-gradient(to top, black 40%, rgba(0, 0, 0, 0.6) 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black 40%, rgba(0, 0, 0, 0.6) 80%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Content anchored bottom-left */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-8 flex flex-col gap-2">
        {/* Title */}
        <h3
          className="text-white font-display font-bold text-lg leading-tight truncate"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
        >
          {title}
        </h3>

        {/* Metadata row */}
        <div
          className="flex items-center gap-2 text-white/85"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
        >
          {metaIcon}
          <span className="text-sm font-medium leading-none truncate">
            {metaText}
          </span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        aria-label={ariaLabel ?? title}
        className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] transition-transform"
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel ?? title}
        className="group block w-full rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] transition-transform"
      >
        {content}
      </button>
    );
  }

  return <div className="group">{content}</div>;
}
