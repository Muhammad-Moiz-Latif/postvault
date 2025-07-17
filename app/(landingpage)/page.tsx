import HeroSection from "@/components/hero";
import NavBar from "@/components/navbar";

export default function Home(){
  return(
    <>
      <div className="flex flex-col min-h-screen">
        <NavBar/>
        <HeroSection/>
      </div>
    </>
  )
}