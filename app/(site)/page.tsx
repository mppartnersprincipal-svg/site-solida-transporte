import { Hero } from "@/components/home/Hero";
import { RoutesSection } from "@/components/home/RoutesSection";
import { Pillars } from "@/components/home/Pillars";
import { LeanStock } from "@/components/home/LeanStock";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Segments } from "@/components/home/Segments";
import { WhySolida } from "@/components/home/WhySolida";
import { PriceValue } from "@/components/home/PriceValue";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <RoutesSection />
      <Pillars />
      <LeanStock />
      <HowItWorks />
      <Segments />
      <WhySolida />
      <PriceValue />
      <Testimonials />
      <BlogTeaser />
      <FinalCta />
    </>
  );
}
