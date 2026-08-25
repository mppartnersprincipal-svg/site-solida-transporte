import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { RoutesSection } from "@/components/home/RoutesSection";
import { Pillars } from "@/components/home/Pillars";
import { Solutions } from "@/components/home/Solutions";
import { LeanStock } from "@/components/home/LeanStock";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Segments } from "@/components/home/Segments";
import { WhySolida } from "@/components/home/WhySolida";
import { OperationGallery } from "@/components/home/OperationGallery";
import { PriceValue } from "@/components/home/PriceValue";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <RoutesSection />
      <Pillars />
      <Solutions />
      <LeanStock />
      <HowItWorks />
      <Segments />
      <WhySolida />
      <OperationGallery />
      <PriceValue />
      <BlogTeaser />
      <FinalCta />
    </>
  );
}
