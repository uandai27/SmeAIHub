import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/marketing/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <Navbar />
      <Hero />
    </main>
  );
}