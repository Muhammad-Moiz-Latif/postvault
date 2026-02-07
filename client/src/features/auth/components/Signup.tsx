import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react"
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { VerifyEmail } from "./verifyEmail";
import { useSignup } from "../queries/useSignup";
import logo from '../../../assets/logo.png';
import google from '../../../assets/google.png';
import show from '../../../assets/show.png';
import hide from '../../../assets/eye.png';
import bg from '../../../assets/login_bg.jpg';


const signupSchema = z.object({
    username: z.string().min(8, "Minimum 8 characters are required").max(25, "username is too long"),
    email: z.email("Please enter a valid email").trim(),
    image: z.instanceof(FileList)
        .refine(files => files.length > 0, "Please select a profile image")
        .refine(files => files.length > 0 && files[0].size < 10_000_000, "Image must be less than 10MB")
        .refine(files => files.length > 0 && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0].type), "Only JPEG, PNG, GIF, and WEBP formats are supported"),
    password: z.string().min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
        .min(1, "Please confirm your password")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type signupType = z.infer<typeof signupSchema>;

export const SignUp = ({ isLogin, setLogin }: { isLogin: boolean, setLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [verificationTokenId, setVerificationTokenId] = useState<string | null>(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [Visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const { mutate, isPending } = useSignup();
    const { handleSubmit, register, watch, reset, formState: { errors } } = useForm<signupType>({
        resolver: zodResolver(signupSchema)
    });

    const profilePicture = watch("image");

    useEffect(() => {
        if (!profilePicture || profilePicture.length === 0) {
            setPreviewUrl("");
            return;
        }

        const file = profilePicture[0];
        const objectURL = URL.createObjectURL(file);
        setPreviewUrl(objectURL);

        return () => URL.revokeObjectURL(objectURL);
    }, [profilePicture]);

    const onSubmit: SubmitHandler<signupType> = async (data) => {
        mutate(data, {
            onSuccess: (response) => {
                if (response.success) {
                    setVerificationTokenId(response.data!);
                    setShowVerifyModal(true);
                    reset();
                    setPreviewUrl("");
                }
            },
            onError: (error: any) => {
                setErrorMessage(error.response.data.message);
                console.error("Signup error in component:", error);
            }
        })
    }

    return (
        <div className="flex w-full h-screen p-3 justify-center items-center bg-background">
            {showVerifyModal && <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40" />}

            {showVerifyModal && <div className="fixed inset-0 z-50 flex items-center justify-center">
                <VerifyEmail tokenId={verificationTokenId} setVerifyModal={setShowVerifyModal} setIsLogin={setLogin} />
            </div>}

            <div className='w-full h-full rounded-2xl border border-primary/40 relative'>
                <img src={bg} className='size-full rounded-2xl' />
                <h1 className='absolute bottom-10 left-3 font-serif text-5xl tracking-tight text-primary'>A calm place for your words.</h1>
                <p className='absolute left-3 bottom-3 font-serif tracking-tight text-primary text-lg'>Write without distraction. Share with intention.</p>
            </div>
            <div className='w-full h-full flex flex-col justify-start pt-15 items-center relative'>
                <img src={logo} className='size-24 object-contain absolute -top-5 left-5' />
                <div className='mb-4 text-center'>
                    <h1 className='text-center tracking-tight text-2xl font-sans text-foreground'>Create an account to write and publish</h1>
                    <p className='text-sm text-muted-foreground tracking-tight font-sans'>Please enter your details to sign up.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
                    <div className="flex justify-center items-center bg-muted mx-20 p-0.75 rounded-[4px] mb-4">
                        <button
                            type='button'
                            onClick={() => setLogin(true)}
                            className={`hover:cursor-pointer tracking-tight font-sans ${isLogin ? "bg-primary text-primary-foreground" : "bg-zinc-300 text-secondary-foreground"} w-full h-8 rounded-l-[4px]`}
                        >
                            Login
                        </button>
                        <button
                            type='button'
                            onClick={() => setLogin(false)}
                            className={`hover:cursor-pointer tracking-tight font-sans ${!isLogin ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"} w-full h-8 rounded-r-[4px]`}
                        >
                            Signup
                        </button>
                    </div>

                    {/* ENTER PROFILE PICTURE */}
                    <div className="flex justify-center mb-1.5">
                        <label htmlFor="profile-picture" className="cursor-pointer">
                            <div className="size-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border hover:border-primary transition-all">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-xl">📷</div>
                                )}
                            </div>
                            <input
                                {...register("image")}
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                            />
                        </label>
                    </div>
                    {errors.image && <p className="text-destructive text-xs text-center mb-2 font-sans">{errors.image.message}</p>}
                    {errorMessage && <p className="text-destructive text-xs text-center mb-2 font-sans">{errorMessage}</p>}

                    {/* ENTER USERNAME */}
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
                        <div>
                            <input
                                {...register("username")}
                                className="w-full h-8 rounded-[6px] bg-background border border-border text-sm px-3 py-2 text-foreground font-sans outline-none focus:ring-2 focus:ring-ring"
                                type="text"
                                placeholder="Enter your username"
                            />
                            {errors.username && <p className="text-destructive text-xs mt-0.5 font-sans">{errors.username.message}</p>}
                        </div>

                        {/* ENTER EMAIL */}
                        <div>
                            <input
                                {...register("email")}
                                className="w-full h-8 rounded-[6px] bg-background border border-border text-sm px-3 py-2 text-foreground font-sans outline-none focus:ring-2 focus:ring-ring"
                                type="email"
                                placeholder="Enter your email address"
                            />
                            {errors.email && <p className="text-destructive text-xs mt-0.5 font-sans">{errors.email.message}</p>}
                        </div>

                        {/* ENTER PASSWORD */}
                        <div>
                            <div className="flex relative">
                                <input
                                    {...register('password')}
                                    className="w-full h-8 rounded-[6px] bg-background border border-border text-sm px-3 py-2 text-foreground font-sans outline-none focus:ring-2 focus:ring-ring"
                                    type={isVisible ? "text" : "password"}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type='button'
                                    className='hover:cursor-pointer absolute right-2 bottom-1.5'
                                    onClick={() => setIsVisible((prev) => !prev)}>
                                    <img src={isVisible ? show : hide} className='size-5' />
                                </button>
                            </div>

                            {errors.password && <p className="text-destructive text-xs mt-0.5 font-sans">{errors.password.message}</p>}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <div className="flex relative">
                                <input
                                    {...register('confirmPassword')}
                                    className="w-full h-8 rounded-[6px] bg-background border border-border text-sm px-3 py-2 text-foreground font-sans outline-none focus:ring-2 focus:ring-ring"
                                    type={Visible ? "text" : "password"}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type='button'
                                    className='hover:cursor-pointer absolute right-2 bottom-1.5'
                                    onClick={() => setVisible((prev) => !prev)}>
                                    <img src={Visible ? show : hide} className='size-5' />
                                </button>
                            </div>

                            {errors.confirmPassword && <p className="text-destructive text-xs mt-0.5 font-sans">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary text-primary-foreground hover:cursor-pointer w-full h-9 rounded-[6px] disabled:opacity-50 font-sans text-sm font-medium hover:bg-primary/90 transition"
                    >
                        {isPending ? "Creating account..." : "Create account"}
                    </button>

                    <div className='flex my-2 gap-3 justify-center items-center'>
                        <div className='w-full bg-border h-px'></div>
                        <h1 className='text-xs text-muted-foreground font-sans'>OR</h1>
                        <div className='w-full bg-border h-px'></div>
                    </div>

                    {/* GOOGLE  BUTTON */}
                    <div
                        onClick={() => {
                            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
                        }}
                        className="w-full h-9 text-sm hover:cursor-pointer bg-background rounded-[6px] font-base border border-border transition flex justify-center items-center gap-1 overflow-hidden text-foreground font-sans hover:text-accent-foreground"
                    >
                        <span>Continue with</span>
                        <img src={google} className='size-10 mt-0.5' />
                    </div>
                </form>
                <h1 className='text-xs tracking-tight text-zinc-400 font-sans absolute bottom-0 left-5'>Copyright 2025 @ PostVault LTD.</h1>
                <h1 className='text-xs tracking-tight text-zinc-400 font-sans absolute bottom-0 right-5'>Privacy Policy</h1>
            </div>
        </div>
    )
}