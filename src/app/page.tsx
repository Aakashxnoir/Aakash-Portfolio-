import type { Metadata } from "next";
import ContactCall from "@/components/home/ContactCall";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import RecognitionStrip from "@/components/home/RecognitionStrip";
import WorkIndex from "@/components/home/WorkIndex";
import { hero, site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Portfolio` },
  description: hero.line,
};

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <WorkIndex />
      <RecognitionStrip />
      <ContactCall />
    </>
  );
}
