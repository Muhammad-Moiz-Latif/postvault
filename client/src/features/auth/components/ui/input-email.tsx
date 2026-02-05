import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod"
import { useForgot } from "../../queries/useForgot";
import { useState } from "react";

const resetEmailSchema = z.object({
    email: z.email("Please enter a vaild email").min(1, "Email is required").trim()
});

export type resetEmailType = z.infer<typeof resetEmailSchema>;

export default function EnterEmail({ setReset }: { setReset: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [Message, setMessage] = useState("");
    const { register, handleSubmit, reset, formState: {
        errors
    } } = useForm({
        resolver: zodResolver(resetEmailSchema)
    });
    const { mutate, isPending } = useForgot();

    const onSubmit: SubmitHandler<resetEmailType> = async (data) => {
        mutate(data.email, {
            onSuccess: (response) => {
                if (response.success) {
                    setMessage("A verification link has been sent to your email");
                    reset()
                }
            },
            onError: (response) => {
                setMessage("Could not send verification link");
                console.error(response.message);
            }
        })
    };


    return (
        <div className="w-1/2 h-40 bg-white rounded-[4px] border border-zinc-300 p-3">
            <button className="bg-red-400 text-white px-4 rounded-[4px] hover:cursor-pointer"
                onClick={() => setReset(prev => !prev)}
            >
                Close
            </button>
            {
                Message && <h1 className="text-emerald-500 tracking-tight">{Message}</h1>
            }
            <form className="mb-4 flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
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
                <button
                    className="w-full h-7 text-sm tracking-tight flex justify-center items-center bg-black text-white rounded-[4px] hover:cursor-pointer"
                >
                    {isPending ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    )
}