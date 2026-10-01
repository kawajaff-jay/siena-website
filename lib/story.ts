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
