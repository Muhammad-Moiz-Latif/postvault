import bgImage from '../../../assets/hand-drawn-business-communication-concept.png';
import logo from '../../../assets/POSTVAULT.png';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['400', '700', '600', '500'],
    subsets: ['latin'],
});


export default function LoginPage() {
    return (
        <>
            <div className="max-w-full h-screen flex justify-center items-center bg-sky-200 p-8">
                <div className="bg-white rounded-xl w-full h-full flex">
                    <div className='w-1/2 rounded-xl relative m-3 bg-sky-50'>
                        <img src={bgImage.src} className='w-full' />
                        <h1 className={`text-center ${roboto.className} text-2xl`}>Every story deserves a safe place — welcome to</h1>
                        <img src={logo.src} className='w-52 absolute -bottom-9 right-52 ' />
                    </div>
                    <div className={`w-1/2 rounded-r-xl bg-white flex flex-col py-5 px-24 ${roboto.className}`}>
                        <h1 className='text-[40px] font-medium'>Create an account</h1>
                        <h1 className='text-sm mt-2'>Already have an account? <span className='text-sky-600 hover:cursor-pointer'>Log in</span></h1>
                        <form className='flex flex-col gap-3 mt-10'>
                            <input className='w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400' placeholder='Username' />
                            <input className='w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400' placeholder='Email' type='email'/>
                            <input className='w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400' placeholder='Password' type='password'/>
                            <div className='mt-1 flex items-center gap-3 mb-5'>
                                <input type='checkbox' className='w-5 h-5' />
                                <label className='text-sm'>I agree to the <span className='underline text-sky-600 hover:cursor-pointer'>Terms & Conditions</span></label>
                            </div>
                            <button className='w-full h-11 rounded-md text-white bg-sky-600 mb-3'>Create account</button>
                        </form>
                        <div className='flex justify-evenly items-center mb-3'>
                            <hr className=" flex-grow border-sky-400" />
                            <h1 className='text-xs text-sky-400 mx-4'>Or register with</h1>
                            <hr className=" flex-grow border-sky-400" />
                        </div> 
                        <button className='w-full h-11 rounded-md text-white bg-sky-600'>Google button</button>
                    </div>
                </div>
            </div>
        </>
    )
}

