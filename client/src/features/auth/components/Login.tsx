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
import show from '../../../assets/show.png';
import hide from '../../../assets/eye.png';
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
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuth } = useAuth();

    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
        mutate(data, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message);
                    setAuth({ access_token: response.access_token!, user_id: response.data?._id! });
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


            <div className='hidden lg:block w-full h-full rounded-2xl border border-primary/40 relative animate-slide-left'>
                <img src={bg} className='size-full rounded-2xl' />
                <h1 className='absolute bottom-10 left-3 font-serif text-3xl lg:text-5xl tracking-tight text-primary'>A calm place for your words.</h1>
                <p className='absolute left-3 bottom-3 font-serif tracking-tight text-primary text-sm lg:text-lg'>Write without distraction. Share with intention.</p>
            </div>
            <div className='w-full h-full flex flex-col justify-between py-10 lg:py-20 items-center relative animate-slide-down'>
                <img src={logo} className='size-16 lg:size-24 object-contain absolute -top-5 left-5 animate-slide-down' style={{ animationDelay: '0.1s' }} />
                <div className='mb-4 text-center px-4 animate-slide-down' style={{ animationDelay: '0.2s' }}>
                    <h1 className='text-center tracking-tight text-xl lg:text-2xl font-sans text-foreground'>Continue where you left off</h1>
                    <p className='text-xs lg:text-sm text-muted-foreground tracking-tight font-sans'>Please enter your details to sign in.</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-xs lg:max-w-sm px-4 lg:px-0 animate-slide-down"
                    style={{ animationDelay: '0.3s' }}
                >
                    <div className="flex justify-center items-center bg-muted mx-4 lg:mx-20 p-0.75 rounded-[4px]">
                        <button
                            type='button'
                            onClick={() => setLogin(true)}
                            className={`hover:cursor-pointer tracking-tight font-sans text-xs lg:text-sm ${isLogin ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}  w-full h-8 rounded-l-[4px]`}
                        >
                            Login
                        </button>

                        <button
                            type='button'
                            onClick={() => setLogin(false)}
                            className={`hover:cursor-pointer tracking-tight font-sans text-xs lg:text-sm ${!isLogin ? "bg-primary text-primary-foreground" : "bg-zinc-300 text-secondary-foreground"}  w-full h-8 rounded-r-[4px]`}
                        >
                            Signup
                        </button>
                    </div>

                    {errorMessage && <h1 className="text-destructive font-sans text-xs lg:text-sm tracking-tight my-1 text-center">{errorMessage}</h1>}

                    {/* ENTER EMAIL */}
                    <div className="mb-2">
                        <label htmlFor="email" className="block text-xs lg:text-sm tracking-tight font-base text-muted-foreground mb-0.5 font-sans">
                            Email
                        </label>
                        <input
                            id="email"
                            {...register("email")}
                            placeholder="you@example.com"
                            className={`w-full px-3 lg:px-4 text-xs lg:text-sm py-2 border rounded-[6px] outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-sans ${errors.email ? 'border-destructive' : 'border-border'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-destructive text-xs mt-1 tracking-tight font-sans">{errors.email.message}</p>
                        )}
                    </div>

                    {/* ENTER PASSWORD */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-xs lg:text-sm tracking-tight font-base text-muted-foreground mb-0.5 font-sans">
                            Password
                        </label>
                        <div className='flex relative'>
                            <input
                                id="password"
                                type={isVisible ? "text" : "password"}
                                {...register("password")}
                                placeholder="Enter your password"
                                className={`w-full px-3 lg:px-4 py-2 text-xs lg:text-sm border rounded-[6px] outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-sans ${errors.password ? 'border-destructive' : 'border-border'
                                    }`}
                            />
                            <button
                                type='button'
                                className='hover:cursor-pointer absolute right-2 bottom-2'
                                onClick={() => setIsVisible((prev) => !prev)}>
                                <img src={isVisible ? show : hide} className='size-4 lg:size-5' />
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-destructive text-xs tracking-tight font-sans">{errors.password.message}</p>
                        )}
                    </div>

                    {/* FORGOT PASSWORD */}
                    <button
                        type='button'
                        className='text-xs text-end mb-2 w-full tracking-tight hover:cursor-pointer text-primary font-sans'
                        onClick={() => setReset((prev) => !prev)}
                    >
                        Forgot password
                    </button>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full text-xs lg:text-sm hover:cursor-pointer bg-primary text-primary-foreground py-2 rounded-[6px] font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition font-sans"
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>

                    <div className='flex my-2 gap-3 justify-center items-center'>
                        <div className='w-full bg-border h-px'></div>
                        <h1 className='text-xs text-muted-foreground font-sans'>OR</h1>
                        <div className='w-full bg-border h-px'></div>
                    </div>

                    {/* GOOGLE BUTTON */}
                    <div
                        onClick={() => {
                            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
                        }}
                        className="w-full h-9 text-xs lg:text-sm hover:cursor-pointer bg-background rounded-[6px] font-base border border-border disabled:bg-muted disabled:cursor-not-allowed transition flex justify-center items-center gap-1 overflow-hidden text-foreground font-sans"
                    >
                        <span>Continue with</span>
                        <img src={google} className='size-8 lg:size-10 mt-0.5' />
                    </div>
                </form>
                <h1 className='text-xs tracking-tight text-zinc-400 font-sans absolute bottom-2 lg:bottom-0 left-3 lg:left-5 text-center lg:text-left animate-slide-up' style={{ animationDelay: '0.5s' }}>Copyright 2025 @ PostVault LTD.</h1>
                <h1 className='text-xs tracking-tight text-zinc-400 font-sans absolute bottom-2 lg:bottom-0 right-3 lg:right-5 text-center lg:text-right animate-slide-up' style={{ animationDelay: '0.5s' }}>Privacy Policy</h1>
            </div>
        </div>
    )
}
