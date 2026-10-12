import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Reveal easing, matching --ease-out in globals.css. */
export const EASE_OUT = "expo.out";
/** Curtain easing. */
export const EASE_IN_OUT = "power3.inOut";

export { gsap, ScrollTrigger, SplitText };
