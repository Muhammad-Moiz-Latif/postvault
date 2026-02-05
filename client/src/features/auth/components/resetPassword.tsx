import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router"
import z from "zod";
import { useReset } from "../queries/useReset";
import { toast, ToastContainer } from 'react-toastify';


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
        <div className="w-full h-screen flex justify-center items-center">
            <ToastContainer
                position='top-center'
                closeOnClick
                draggable
                hideProgressBar={true}
            />
            <form
                className="w-1/2 h-1/2 rounded-[4px] border border-zinc-300 p-3 flex flex-col justify-evenly items-center"
                onSubmit={handleSubmit(onSubmit)}

            >
                <h1>Reset your password</h1>

                {errorMessage && <h1 className="text-red-600">{errorMessage}</h1>}


                {/* ENTER PASSWORD */}
                <input
                    {...register('password')}
                    className="w-full outline-0 h-9 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="password"
                    placeholder="Password"
                />
                <h1 className="text-red-500 text-sm">
                    {errors.password?.message}
                </h1>

                {/* ENTER CONFIRMATION PASSWORD */}
                <input
                    {...register('confirm_password')}
                    className="w-full outline-0 h-9 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="password"
                    placeholder="Confirm password"
                />
                <h1 className="text-red-500 text-sm">
                    {errors.confirm_password?.message}
                </h1>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    // disabled={isPending}
                    className="bg-black text-white hover:cursor-pointer w-full h-9 rounded-[6px] disabled:opacity-50"
                >
                    {isPending ? "Resetting..." : "Reset password"}
                </button>
            </form>
        </div>
    )
}

export default ResetPassword