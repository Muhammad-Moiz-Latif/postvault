'use client'

import { useState } from 'react';
import bgImage from '../../../assets/hand-drawn-business-communication-concept.png';
import logo from '../../../assets/POSTVAULT.png';
import { Roboto } from 'next/font/google';
import visible from '../../../assets/visible.png';
import hide from '../../../assets/hide.png';
import google from '../../../assets/google.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignIn, SignInFormData } from '@/lib/validation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { signIn } from "next-auth/react"

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/state/features/userInfoSlice';
import { email } from 'zod';

const roboto = Roboto({
    weight: ['400', '700', '600', '500'],
    subsets: ['latin'],
});


export default function SigninPage() {
    const [sameUser, setsameUser] = useState();
    const [isHidden1, setIsHidden1] = useState(true);
    const dispatch = useDispatch();

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
        resolver: zodResolver(UserSignIn)
    });;

    async function onSubmit(formdata: SignInFormData) {
        try {
            const response = await axios.post('/api/auth/signin', formdata);
            if (response.status === 200) {
                dispatch(setUserInfo({ username: formdata.username, email: formdata.email }));
                toast.success("User created successfully!");
                router.replace('/home');
            }

        } catch (error: any) {
            setsameUser(error.response.data.message);
        }
    };

    return (
        <>
            <div className="max-w-full h-screen flex justify-center items-center bg-sky-200 p-8">
                <div className="bg-white rounded-xl w-full h-full flex">
                    <div className='w-1/2 rounded-xl relative m-3 bg-sky-50'>
                        <img src={bgImage.src} className='w-full' />
                        <h1 className={`text-center ${roboto.className} text-2xl`}>Every story deserves a safe place — welcome to</h1>
                        <img src={logo.src} className='w-52 absolute -bottom-9 right-52 ' />
                    </div>
                    <div className={`w-1/2 relative rounded-r-xl bg-white flex flex-col py-5 px-24 ${roboto.className}`}>
                        <h1 className='text-[40px] font-medium'>Create an account</h1>
                        <h1 className='text-sm mt-2'>Already have an account? <button onClick={() => router.push('login')} className='text-sky-600 hover:cursor-pointer'>Log in</button></h1>
                        <p className='text-xs text-red-500 absolute top-30'>{sameUser}</p>
                        <form className='flex flex-col gap-3 mt-10' onSubmit={handleSubmit(onSubmit)} noValidate>
                            <input
                                {...register('username')}
                                className='w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400' placeholder='Username' name='username' />
                            {errors.username && <p className="text-red-500 text-xs -my-2">{errors.username.message}</p>}
                            <input
                                {...register('email')}
                                className='w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400' placeholder='Email' type='email' name='email' />
                            {errors.email && <p className="text-red-500 text-xs -my-2 ">{errors.email.message}</p>}
                            <div className='relative'>
                                <input
                                    {...register('password')}
                                    className='w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400' placeholder='Password' type={isHidden1 ? 'password' : 'text'} name='password' />
                                <button className='hover:cursor-pointer' type='button' onClick={() => setIsHidden1(!isHidden1)}>
                                    <img src={isHidden1 ? hide.src : visible.src} className='w-6 absolute right-4 top-[10px]' />
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs -my-2 ">{errors.password.message}</p>}

                            <div className='mt-1 flex items-center gap-3 mb-5'>
                                <input
                                    {...register('checkbox')}
                                    type='checkbox' className='w-5 h-5' name='checkbox' />
                                <label className='text-xs -my-2'>I agree to the <span className='underline text-sky-600 hover:cursor-pointer'>Terms & Conditions</span></label>
                            </div>
                            {errors.checkbox && <p className='text-red-500 text-xs -mt-5'>{errors.checkbox.message}</p>}
                            <button className='w-full h-11 rounded-md text-white bg-sky-600 mb-3 cursor-pointer'>Create account</button>
                        </form>
                        <div className='flex justify-evenly items-center mb-3'>
                            <hr className=" flex-grow border-sky-400" />
                            <h1 className='text-xs text-sky-400 mx-4'>Or register with</h1>
                            <hr className=" flex-grow border-sky-400" />
                        </div>

                        <button onClick={() => signIn("google", {
                            callbackUrl: '/home'
                        })} className='w-full h-11 rounded-md text-white border-sky-600 border-[1px] hover:cursor-pointer'>
                            <div className='flex items-center justify-center gap-2 w-full h-full'>
                                <img src={google.src} className='w-5 h-5' />
                                <span className='text-base text-sky-600'>Continue with Google</span>
                            </div>
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}

