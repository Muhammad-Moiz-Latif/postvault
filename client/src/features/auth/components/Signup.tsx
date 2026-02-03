import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react"
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

const signupSchema = z.object({
    username: z.string().min(8, "Minimum 8 characters are required").max(25, "username is too long"),
    email: z.email("Please enter a valid email").trim(),
    image: z.file("Please select a profile image").mime(['image/jpeg', 'image/gif', 'image/png', 'image/webp']).max(10_1000, "cannot support images larger that 10MB's"),
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
        .min(1, "Please confirm your password")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

type signupType = z.infer<typeof signupSchema>;

export const SignUp = ({ isLogin, setLogin }: { isLogin: boolean, setLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const { handleSubmit, register, reset, formState: {
        errors
    } } = useForm<signupType>({
        resolver: zodResolver(signupSchema)
    });

    const onSubmit: SubmitHandler<signupType> = async (data) => {
        console.log(data);
        reset();
    }

    return (
        <div className="flex gap-3 w-full h-full justify-center items-center">
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
                <input
                    {...register('image')}
                    className="size-20 rounded-full bg-zinc-500 text-sm p-2 flex justify-center items-center "
                    type="file"
                    accept="image/*"
                />
                <h1 className="text-red-500 text-sm">{errors.image && errors.image.message}</h1>
                <input
                    {...register("username")}
                    className="w-full outline-0 h-8 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="text"
                    placeholder="Username"
                />
                <h1 className="text-red-500 text-sm">{errors.username && errors.username.message}</h1>
                <input
                    {...register("email")}
                    className="w-full outline-0 h-8 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="email"
                    placeholder="Email"
                />
                <h1 className="text-red-500 text-sm">{errors.email && errors.email.message}</h1>
                <input
                    {...register('password')}
                    className="w-full outline-0 h-8 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="password"
                    placeholder="Password"
                />
                <h1 className="text-red-500 text-sm">
                    {errors.password?.message}
                </h1>
                <input
                    {...register('confirmPassword')}
                    className="w-full outline-0 h-8 rounded-[6px] bg-zinc-500 text-sm p-2"
                    type="password"
                    placeholder="Confirm password"
                />
                <h1 className="text-red-500 text-sm">
                    {errors.confirmPassword?.message}
                </h1>
                <button className="bg-black text-white  hover:cursor-pointer w-full h-9 rounded-[6px]"
                >
                    Create account
                </button>
            </form>
        </div>
    )
}