/**
 * Application-wide constants.
 * Centralises storage keys, animation timings and magic numbers for maintainability.
 */

/** Session storage key used to scroll to a section after navigation (e.g. from Contact to Home). */
export const SCROLL_TO_SECTION_KEY = "scrollToSection";

/** Welcome screen: time until onContinue is called after closing animation starts (ms). Must match $welcome-close-total-duration in welcome-screen.scss. */
export const WELCOME_CLOSE_DELAY_MS = 750;

/** WheelPicker: minimum ms between wheel steps (throttle). */
export const WHEEL_PICKER_THROTTLE_MS = 170;

/** WaveBars: number of bars. */
export const WAVE_BARS_COUNT = 16;

/** WaveBars: visual weight when no hover. */
export const WAVE_BARS_BASE_WEIGHT = 1;

/** WaveBars: peak weight under pointer. */
export const WAVE_BARS_PEAK_WEIGHT = 5;

/** WaveBars: gaussian spread (higher = wider wave). */
export const WAVE_BARS_SIGMA = 2;

/** WheelPicker: degrees between items. */
export const WHEEL_PICKER_STEP_ANGLE = 30;

/** WheelPicker: cylinder radius in px. */
export const WHEEL_PICKER_RADIUS = 120;

/** WheelPicker: item height in px (must match SCSS). */
export const WHEEL_PICKER_ITEM_HEIGHT = 44;

/** Home section IDs for scroll / WaveBars navigation. */
export const HOME_SECTION_IDS = {
  INTRO: "home-intro",
  EXPERIENCE: "home-experience",
  EDUCATION: "home-education"
};

/** Home section IDs in DOM order; used to resolve which section is "at" the wavebar when several intersect. */
export const HOME_WAVEBAR_SECTION_IDS = [
  HOME_SECTION_IDS.INTRO,
  HOME_SECTION_IDS.EXPERIENCE,
  HOME_SECTION_IDS.EDUCATION
];

/** Section that gets a different wavebar color; all others use default (bg). */
export const WAVEBAR_SPECIAL_SECTION_ID = HOME_SECTION_IDS.EXPERIENCE;
