import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router"
import z from "zod";
import { useReset } from "../queries/useReset";
import { toast } from 'sonner';
import password from '../../../assets/password.png';


const resetPasswordSchema = z.object({
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string()
        .min(1, "Confirm password is required")
}).refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"]
});

export type resetPasswordType = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const { reset, handleSubmit, register, formState: { errors } } = useForm<resetPasswordType>({
        resolver: zodResolver(resetPasswordSchema)
    });
    const { mutate, isPending } = useReset();
    const navigate = useNavigate();

    useEffect(() => {
        const getToken = searchParams.get('token');
        if (getToken) {
            setToken(getToken)
        } else {
            console.error('No reset token found in URL');
        }
    }, [searchParams]);


    const onSubmit: SubmitHandler<resetPasswordType> = (data) => {
        mutate({
            password: data.password,
            resetToken: token
        }, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message);
                    reset();
                    setTimeout(() => {
                        navigate('/auth');
                    }, 1500);
                };
            },
            onError: (error) => {
                setErrorMessage(error.response.data.message);
                console.error(error);
            }
        })
    };

    return (
        <div className="w-full h-screen flex flex-col gap-3 justify-center items-center">
            <div className="border border-zinc-200 rounded-md p-1.5">
                <img src={password} className="size-5" />
            </div>
            <h1 className="font-sans text-2xl tracking-tight">Set new password</h1>
            <p className="font-sans text-sm tracking-tight text-zinc-500">Must be at least 8 characters</p>
            <form className="mb-4 flex flex-col w-1/2 px-7" onSubmit={handleSubmit(onSubmit)}>
                {errorMessage && (
                    <div className="p-3 mb-4 rounded-md bg-destructive/10 text-destructive text-sm text-center font-medium">
                        {errorMessage}
                    </div>
                )}
                <div className="mb-2">
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
                        <p className="text-destructive text-xs tracking-tight mt-1 font-sans">{errors.password.message}</p>
                    )}
                </div>
                <div className="mb-2">
                    <label htmlFor="password" className="block text-sm tracking-tight font-base text-muted-foreground mb-0.5 font-sans">
                        Confirm password
                    </label>
                    <input
                        id="confirm_password"
                        type="password"
                        {...register("confirm_password")}
                        placeholder="Confirm your password"
                        className={`w-full px-4 py-2 text-sm border rounded-[6px] outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-sans ${errors.confirm_password ? 'border-destructive' : 'border-border'
                            }`}
                    />
                    {errors.confirm_password && (
                        <p className="text-destructive text-xs mt-1 tracking-tight font-sans">{errors.confirm_password.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full text-sm hover:cursor-pointer bg-primary text-primary-foreground py-2 rounded-[6px] font-medium hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition font-sans"
                >
                    {isPending ? 'Resetting...' : 'Reset password'}
                </button>
            </form>
        </div>
    )
}

export default ResetPassword