import HeroSection from "@/components/hero";
import NavBar from "@/components/navbar";

export default async function Home() {
  const navBar = await NavBar(); // await the async component

  return (
    <div className="flex flex-col min-h-screen">
      {navBar}
      <HeroSection />
    </div>
  )
}
