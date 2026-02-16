import { z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useLogin from '../queries/useLogin'
import { useAuth } from '../../../context/authContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import EnterEmail from './ui/input-email';
import logo from '../../../assets/logo.png';
import google from '../../../assets/google.png';
import show from '../../../assets/show.png';
import hide from '../../../assets/eye.png';
import bg from '../../../assets/bg2.png';
import { ArrowRight } from 'lucide-react';
import { EditorialPanel } from './EditorialPanel';


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
        <div className="h-screen w-full flex overflow-hidden bg-background">
            {isReset && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setReset(false)} />}
            {isReset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <EnterEmail setReset={setReset} />
                </div>
            )}

            {/* ═══ Left Panel — Cinematic Editorial ═══ */}
            <EditorialPanel bg={bg} />
            {/* ═══ Right Panel — Login Form ═══ */}
            <div className="w-full lg:w-[45%] flex flex-1 items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
                {/* Subtle background texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

                <div className="w-full max-w-[380px] relative z-10">
                    {/* Mobile branding */}
                    <div className="lg:hidden flex items-center gap-2 mb-6">
                        <img src={logo} alt="PostVault" className="w-8 h-8" />
                        <span className="font-serif text-lg font-semibold text-foreground">PostVault</span>
                    </div>

                    {/* Header with golden accent */}
                    <div className="mb-6 animate-slide-down">
                        <div className="w-8 h-1 bg-primary rounded-full mb-4" />
                        <h2 className="font-serif text-3xl font-bold text-foreground tracking-tight leading-tight">
                            Welcome back
                        </h2>
                        <p className="font-sans text-sm text-muted-foreground mt-1.5">
                            Continue where you left off.
                        </p>
                    </div>

                    {/* Toggle — pill style */}
                    <div className="flex bg-secondary rounded-xl p-1 mb-5 animate-slide-down" style={{ animationDelay: '0.05s' }}>
                        <button
                            onClick={() => setLogin(true)}
                            className={`font-sans hover:cursor-pointer text-sm w-full py-2 rounded-lg transition-all duration-300 ${isLogin ? 'bg-primary text-primary-foreground font-semibold shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setLogin(false)}
                            className={`font-sans hover:cursor-pointer text-sm w-full py-2 rounded-lg transition-all duration-300 ${!isLogin ? 'bg-primary text-primary-foreground font-semibold shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Signup
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {errorMessage && (
                            <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/8 border border-destructive/20 px-4 py-2.5 rounded-xl animate-slide-down">
                                <div className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                                {errorMessage}
                            </div>
                        )}

                        {/* Email — underline style input */}
                        <div className="space-y-1 animate-slide-down" style={{ animationDelay: '0.1s' }}>
                            <label className="font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="you@example.com"
                                className={`w-full px-0 py-2 text-sm bg-transparent text-foreground font-sans outline-none transition-all border-b-2 placeholder:text-muted-foreground/40 focus:border-primary ${errors.email ? 'border-destructive' : 'border-border'}`}
                            />
                            {errors.email && <p className="text-[10px] text-destructive">{errors.email.message}</p>}
                        </div>

                        {/* Password — underline style input */}
                        <div className="space-y-1 animate-slide-down" style={{ animationDelay: '0.15s' }}>
                            <label className="font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={isVisible ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full px-0 py-2 text-sm bg-transparent text-foreground font-sans outline-none transition-all border-b-2 pr-8 placeholder:text-muted-foreground/40 focus:border-primary ${errors.password ? 'border-destructive' : 'border-border'}`}
                                />
                                <button type="button" onClick={() => setIsVisible(prev => !prev)} className="absolute right-0 top-1/2 -translate-y-1/2">
                                    <img src={isVisible ? hide : show} className="size-4 hover:cursor-pointer" alt="toggle" />
                                </button>
                            </div>
                            {errors.password && <p className="text-[10px] text-destructive">{errors.password.message}</p>}
                        </div>

                        {/* Forgot password */}
                        <div className="flex justify-end animate-slide-down" style={{ animationDelay: '0.2s' }}>
                            <button
                                type="button"
                                onClick={() => setReset(prev => !prev)}
                                className="text-xs text-primary font-sans font-medium hover:underline underline-offset-4"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit — bold editorial button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full hover:cursor-pointer py-3 rounded-xl bg-foreground text-background font-sans text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group animate-slide-down"
                            style={{ animationDelay: '0.25s' }}
                        >
                            {isPending ? 'Signing in...' : (
                                <>
                                    Continue
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 animate-slide-down" style={{ animationDelay: '0.3s' }}>
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-[10px] text-muted-foreground font-sans uppercase tracking-widest">or continue with</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Google — outlined editorial */}
                        <button
                            type="button"
                            onClick={() => { window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`; }}
                            className="w-full hover:cursor-pointer py-3 rounded-xl border-2 border-border bg-transparent text-foreground font-sans text-sm font-medium hover:border-foreground hover:bg-secondary/50 transition-all flex items-center justify-center gap-3 animate-slide-down"
                            style={{ animationDelay: '0.35s' }}
                        >
                            <img src={google} className="w-5 h-5" alt="Google" />
                            Continue with Google
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-muted-foreground/60 font-sans mt-6 lg:hidden">
                        © 2025 PostVault LTD. · Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
};
