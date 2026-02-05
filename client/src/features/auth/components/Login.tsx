import { z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useLogin from '../queries/useLogin'
import { useAuth } from '../../../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import EnterEmail from './ui/input-email';



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
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <ToastContainer
                position='top-center'
                closeOnClick
                draggable
                hideProgressBar={true}
            />
            {/* EMAIL VERIFICATION LOGIN */}
            {isReset &&
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />}

            {isReset && <div className="fixed inset-0 z-50 flex items-center justify-center">
                <EnterEmail setReset={setReset} />
            </div>}
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

                {errorMessage && <h1 className="text-red-600">{errorMessage}</h1>}

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
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                </div>
                <button
                    type='button'
                    className='text-xs text-end w-full tracking-tight mb-2 hover:cursor-pointer'
                    onClick={() => setReset((prev) => !prev)}
                >
                    Forgot password
                </button>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full hover:cursor-pointer bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
};
