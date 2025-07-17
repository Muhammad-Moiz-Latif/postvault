import Link from "next/link";

export default function NavBar() {
    return (
        <>
            <div className="flex justify-between px-7 py-3 bg-amber-200">
                <div className="flex items-center">
                    PostVault
                </div>
                <div>
                    <ul className="flex gap-10 items-center">
                        <li>About Us</li>
                        <li>Create</li>
                        <Link href="/login">Sign in</Link>
                        <button className="bg-black p-2 rounded-2xl text-white hover:cursor-pointer">Get Started</button>
                    </ul>
                </div>
            </div>
        </>
    )
}