"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Signin from "../../../assets/login.png";
import Exit from '../../../assets/reject.png';
import { Roboto } from "next/font/google"
import Link from 'next/link';

const roboto = Roboto({
  weight: ['400', '700', '600'],
  subsets: ['latin'],
});

export default function LoginPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const router = useRouter();

  useEffect(() => {
    console.log('i am working');
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);


  return (
    <div>
      <dialog
        ref={dialogRef}
        className="rounded-4xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-6 max-w-sm w-full shadow-lg backdrop:bg-black/50 h-[28rem] bg-gradient-to-b from-sky-200 via-sky-50 to-white "
      >
        <button className='absolute top-3 right-3 hover:cursor-pointer' onClick={()=>router.back()}>
          <img src={Exit.src} className='w-7'/>
        </button>
        <form className={`flex flex-col justify-center gap-2 ${roboto.className}`}>
          <div className='flex justify-center '>
            <img src={Signin.src} className='w-12 bg-white shadow-md shadow-sky-200 p-3 rounded-2xl' />
          </div>
          <h1 className={`text-center text-xl font-semibold ${roboto.className}`}>Sign in with email</h1>
          <input className='outline-0 bg-gray-200 p-1 rounded-xl pl-2 placeholder:text-sm mx-3' type='email' placeholder='Email' />
          <input className='outline-0 bg-gray-200 p-1 rounded-xl pl-2 placeholder:text-sm mx-3' type='password' placeholder='Password' />
          <div className='flex justify-end mr-6 text-sm mb-3'>
            <h1>Forgot passsword?</h1>
          </div>
          <button type='button' className='bg-black text-white py-2 rounded-xl mx-3 text-sm mb-2'>Get Started</button>
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className='flex-grow border-dotted border-t-4 border-t-gray-200 ml-3'></div>
            <h1 className="text-sm text-gray-500 tracking-wide">Or sign in with</h1>
            <div className='border-t-4 flex-grow border-dotted border-t-gray-200 mr-3'></div>
          </div>
          <button className='bg-black text-white p-2 rounded-xl'>
            Google
          </button>
          <p className='text-center mt-2'>Don't have an account? <button className='text-blue-400 hover:cursor-pointer' onClick={() => router.replace('/login')}> Sign Up</button></p>
        </form>
      </dialog>
    </div>

  );
}
