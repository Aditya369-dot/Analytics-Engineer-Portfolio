import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { CareerTrajectory } from "@/components/sections/CareerTrajectory";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Projects />
        <CareerTrajectory />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
