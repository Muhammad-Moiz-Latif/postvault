import { z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useLogin from '../queries/useLogin'
import { useAuth } from '../../../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import EnterEmail from './ui/input-email';
import logo from '../../../assets/logo.png';
import google from '../../../assets/google.png';
import bg from '../../../assets/login_bg.jpg';

const loginSchema = z.object({
    email: z.email("Please enter a valid email")
        .min(1, "Email is required").trim(),
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>

export default function Login({ isLogin, setLogin }: { isLogin: boolean, setLogin: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });
    const [isReset, setReset] = useState(false);
    const { mutate, isPending } = useLogin();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuth } = useAuth();

    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
        mutate(data, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message);
                    setAuth({ access_token: response.access_token!, user_id: response.data._id });
                    reset();
                    setTimeout(() => {
                        navigate('/app');
                    }, 1500);
                };
            },
            onError: (error: any) => {
                setErrorMessage(error.response.data.message);
                console.error("Signup error in component:", error);
            }
        });
    };

    return (
        <div className="w-full h-screen relative p-3 flex justify-center items-center bg-white">
            <ToastContainer
                position='top-center'
                closeOnClick
                draggable
                hideProgressBar={true}
            />

            {isReset && <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40" />}

            {isReset && <div className="fixed inset-0 z-50 flex items-center justify-center">
                <EnterEmail setReset={setReset} />
            </div>}


            <div className='w-full h-full rounded-2xl border border-primary/40 relative'>
                <img src={bg} className='size-full rounded-2xl' />
                <h1 className='absolute bottom-10 left-3 font-serif text-5xl tracking-tight text-primary'>A calm place for your words.</h1>
                <p className='absolute left-3 bottom-3 font-serif tracking-tight text-primary text-lg'>Write stories, notes, and ideas without distraction.</p>
            </div>
            <div className='w-full h-full flex flex-col justify-between py-20 items-center relative'>
                <div className='flex gap-1 justify-center items-center absolute top-3 left-5'>
                    <img src={logo} className='size-6' />
                    <h1 className='font-sans text-xl tracking-tight'>PostVault</h1>
                </div>
                <div className='mb-4'>
                    <h1 className='text-center tracking-tight text-2xl font-sans text-foreground'>Welcome back!</h1>
                    <p className='text-sm text-muted-foreground tracking-tight font-sans'>Please enter your details to sign in.</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-sm"
                >
                    <div className="flex justify-center items-center bg-muted mx-20 p-0.75 rounded-[4px]">
                        <button
                            type='button'
                            onClick={() => setLogin(true)}
                            className={`hover:cursor-pointer tracking-tight font-sans ${isLogin ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}  w-full h-8 rounded-l-[4px]`}
                        >
                            Login
                        </button>

                        <button
                            type='button'
                            onClick={() => setLogin(false)}
                            className={`hover:cursor-pointer tracking-tight font-sans ${!isLogin ? "bg-primary text-primary-foreground" : "bg-zinc-300 text-secondary-foreground"}  w-full h-8 rounded-r-[4px]`}
                        >
                            Signup
                        </button>
                    </div>

                    {errorMessage && <h1 className="text-destructive font-sans">{errorMessage}</h1>}

                    <div className="mb-2">
                        <label htmlFor="email" className="block text-sm tracking-tight font-base text-muted-foreground mb-0.5 font-sans">
                            Email
                        </label>
                        <input
                            id="email"
                            {...register("email")}
                            placeholder="you@example.com"
                            className={`w-full px-4 text-sm py-2 border rounded-[6px] outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-sans ${errors.email ? 'border-destructive' : 'border-border'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-destructive text-xs mt-1 tracking-tight font-sans">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="">
                        <label htmlFor="password" className="block text-sm tracking-tight font-base text-muted-foreground mb-0.5 font-sans">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-2 text-sm border rounded-[6px] outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-sans ${errors.password ? 'border-destructive' : 'border-border'
                                }`}
                        />
                        {errors.password && (
                            <p className="text-destructive text-xs tracking-tight font-sans">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type='button'
                        className='text-xs text-end mb-2 w-full tracking-tight hover:cursor-pointer text-primary font-sans'
                        onClick={() => setReset((prev) => !prev)}
                    >
                        Forgot password
                    </button>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full text-sm hover:cursor-pointer bg-primary text-primary-foreground py-2 rounded-[6px] font-medium hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition font-sans"
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>

                    <div className='flex my-2 gap-3 justify-center items-center'>
                        <div className='w-full bg-border h-px'></div>
                        <h1 className='text-xs text-muted-foreground font-sans'>OR</h1>
                        <div className='w-full bg-border h-px'></div>
                    </div>

                    <div
                        onClick={() => {
                            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
                        }}
                        className="w-full h-9 text-sm hover:cursor-pointer bg-background rounded-[6px] font-base border border-border disabled:bg-muted disabled:cursor-not-allowed transition flex justify-center items-center gap-1 overflow-hidden text-foreground font-sans"
                    >
                        <span>Continue with</span>
                        <img src={google} className='size-10 mt-1' />
                    </div>
                </form>
                <h1 className='text-xs tracking-tight text-zinc-400 font-sans absolute bottom-0 left-5'>Copyright 2025 @ PostVault LTD.</h1>
                <h1 className='text-xs tracking-tight text-zinc-400 font-sans absolute bottom-0 right-5'>Privacy Policy</h1>
            </div>
        </div>
    )
}