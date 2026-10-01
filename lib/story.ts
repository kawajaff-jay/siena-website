"use client";
/**
 * The Evolution story opens as a full-screen layer on top of the main site.
 * Anything can open it: a link to #evolution, an element with [data-open-story], or openStory().
 */
export const STORY_OPEN_EVENT = "siena:story-open";
export const STORY_HASH = "#evolution";

export function openStory() {
  window.dispatchEvent(new CustomEvent(STORY_OPEN_EVENT));
}

/**
 * Story → Solutions hand-off. Fired when the story's ending CTA is clicked, just before the story
 * closes: carries where each function chip was on screen, so Solutions can unfold them into its modules.
 */
export const SOLUTIONS_ARRIVE_EVENT = "siena:solutions-arrive";
export type FnChip = { id: string; label: string; rect: { x: number; y: number; w: number; h: number } };
export type SolutionsArrive = { chips: FnChip[] };

/** fired whenever the story layer opens (anything in progress on the page, e.g. the hand-off, ends) */
export const STORY_OPENED_EVENT = "siena:story-opened";
