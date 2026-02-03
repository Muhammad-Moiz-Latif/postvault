import { z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useLogin from '../queries/useLogin'



const loginSchema = z.object({
    email: z.email("Please enter a valid email")
        .min(1, "Email is required").trim(),
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login({ isLogin, setLogin }: { isLogin: boolean, setLogin: React.Dispatch<React.SetStateAction<boolean>> }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });


    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
        const { mutate, isError, isPending } = useLogin();
        mutate(data);
        reset();
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md "
            >
                <div className="flex gap-3 justify-center">
                    <button
                        type='button'
                        onClick={() => setLogin(true)}
                        className={`hover:cursor-pointer ${isLogin && "bg-black text-white"}  w-20 h-8 rounded-[4px]`}
                    >
                        Login
                    </button>

                    <button
                        type='button'
                        onClick={() => setLogin(false)}
                        className={`hover:cursor-pointer ${!isLogin && "bg-black text-white"}  w-20 h-8 rounded-[4px]`}
                    >
                        Signup
                    </button>
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="Enter your password"
                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
};
