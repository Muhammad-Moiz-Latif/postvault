import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react"
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { VerifyEmail } from "./verifyEmail";
import { useSignup } from "../queries/useSignup";

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
    const [errorMessage, setErrorMessage] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const { mutate, isPending } = useSignup();
    const { handleSubmit, register, watch, reset, formState: {
        errors
    } } = useForm<signupType>({
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
                    setVerificationTokenId(response.data);
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
        <div className="flex relative gap-3 w-full h-full justify-center items-center">

            {/* EMAIL VERIFICATION LOGIN */}
            {showVerifyModal &&
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />}

            {showVerifyModal && <div className="fixed inset-0 z-50 flex items-center justify-center">
                <VerifyEmail tokenId={verificationTokenId} setVerifyModal={setShowVerifyModal} setIsLogin={setLogin} />
            </div>}


            {/* SIGNUP FORM */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-[80vh] h-[90vh] bg-zinc-50 rounded-[10px] border border-zinc-300 p-3 flex flex-col items-center gap-3">

                <div className="flex gap-4 justify-center">
                    <button
                        type="button"
                        onClick={() => setLogin(true)}
                        className={`hover:cursor-pointer ${isLogin && "bg-black text-white"} w-20 h-8 rounded-[4px]`}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => setLogin(false)}
                        className={`hover:cursor-pointer ${!isLogin && "bg-black text-white"} w-20 h-8 rounded-[4px]`}
                    >
                        Signup
                    </button>
                </div>
                {/* Profile Picture Upload */}
                <label htmlFor="profile-picture" className="cursor-pointer">
                    <div className="size-24 rounded-full bg-zinc-300 flex items-center justify-center overflow-hidden border-4 border-zinc-400 hover:border-blue-500 transition-all">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-4xl text-zinc-600">
                                📷
                            </div>
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
                <h1 className="text-red-500 text-sm">{errors.image && errors.image.message}</h1>
                {errorMessage && <h1 className="text-red-600">{errorMessage}</h1>}


                {/* ENTER USERNAME */}
                <input
                    {...register("username")}
                    className="w-full outline-0 h-8 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="text"
                    placeholder="Username"
                />
                <h1 className="text-red-500 text-sm">{errors.username && errors.username.message}</h1>

                {/* ENTER EMAIL */}
                <input
                    {...register("email")}
                    className="w-full outline-0 h-8 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="email"
                    placeholder="Email"
                />
                <h1 className="text-red-500 text-sm">{errors.email && errors.email.message}</h1>

                {/* ENTER PASSWORD */}
                <input
                    {...register('password')}
                    className="w-full outline-0 h-8 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="password"
                    placeholder="Password"
                />
                <h1 className="text-red-500 text-sm">
                    {errors.password?.message}
                </h1>

                {/* ENTER CONFIRMATION PASSWORD */}
                <input
                    {...register('confirmPassword')}
                    className="w-full outline-0 h-8 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="password"
                    placeholder="Confirm password"
                />
                <h1 className="text-red-500 text-sm">
                    {errors.confirmPassword?.message}
                </h1>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black text-white hover:cursor-pointer w-full h-9 rounded-[6px] disabled:opacity-50"
                >
                    {isPending ? "Creating account..." : "Create account"}
                </button>
            </form>
        </div>
    )
}