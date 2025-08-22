import { DM_Sans } from "next/font/google";
import bulb from '../assets/creative-light-bulb-abstract-glowing-blue-background-generative-ai-Photoroom.png';

const dm_sans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '900', '800', '700']
});

export default function HeroSection() {
    return (
        <>
            <div className={`flex relative items-center w-full h-screen overflow-hidden py-7 px-10 ${dm_sans.className}`}>
                <div className="flex flex-col gap-7 items-start z-20">
                    <h1 className="text-8xl tracking-tighter">Your Thoughts. <br/>Secured.</h1>
                    <h2 className="text-justify text-2xl">Your content deserves more than clicks — PostVault <br/>gives it permanence and power</h2>
                    <button className="bg-sky-950 px-4 py-3 text-xl rounded-2xl text-white hover:cursor-pointer ">Start exploring</button>
                </div>
                
                <img src={bulb.src} className="size-[55rem] -rotate-90 object-contain absolute -right-60 z-0" />
            </div>
        </>
    )
}