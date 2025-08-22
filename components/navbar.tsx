import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/auth";
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '900', '800', '700']
});

const dm_sans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '900', '800', '700']
});

export default async function NavBar() {
    const session = await auth();
    return (
        <>
            <div className={`flex fixed w-full justify-between border-b border-b-sky-100 px-10 py-3 bg-sky-50/40 font-medium tracking-tight text-[17px] ${dm_sans.className} z-10`}>
                <div className={`flex items-center ${playfair.className} font-semibold text-2xl`}>
                    PostVault
                </div>
                <div>
                    <ul className="flex gap-10 items-center">
                        <li className="hover:cursor-pointer tracking-tighter text-[16px]">About Us</li>
                        <li className="hover:cursor-pointer tracking-tighter text-[16px]">Create</li>
                        <li className="hover:cursor-pointer tracking-tighter text-[16px]">Subscription</li>
                        {session?.user ? <form
                            action={async () => {
                                "use server"
                                await signOut()
                            }}
                        >
                            <button type="submit" className="hover:cursor-pointer text-[16px] tracking-tighter">Sign Out</button>
                        </form> : <Link href="signup" className="hover:cursor-pointer text-[16px] tracking-tighter">Sign in</Link>
                        }
                        <button className="bg-sky-950 text-sm px-4 py-3 rounded-2xl text-white hover:cursor-pointer ">Get Started</button>
                    </ul>
                </div>
            </div>
        </>
    )
}