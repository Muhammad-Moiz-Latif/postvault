import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod"
import { useForgot } from "../../queries/useForgot";
import { useState } from "react";
import fingerprint from '../../../../assets/fingerprint.png';
import { MoveLeft } from "lucide-react";

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
        <div className="w-[35%] h-[60%] flex flex-col justify-center gap-3 items-center bg-white rounded-2xl border border-zinc-300 p-3">

            <div className="border border-zinc-200 rounded-md p-1.5">
                <img src={fingerprint} className="size-5" />
            </div>
            <h1 className="font-sans text-2xl tracking-tight">Forgot password?</h1>
            <p className="font-sans text-sm tracking-tight text-zinc-500">No worries, we'll send you reset instructions</p>
            {
                Message && <h1 className="text-emerald-500 font-sans text-xs tracking-tight">{Message}</h1>
            }
            <form className="mb-4 flex flex-col w-full px-7" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email" className="block text-sm mb-1 tracking-tight font-base text-muted-foreground font-sans">
                    Email
                </label>
                <input
                    id="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`w-full px-4 text-sm py-2 border rounded-[6px] outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-sans ${errors.email ? 'border-destructive' : 'border-border'
                        }`}
                />
                {errors.email && (
                    <p className="text-destructive text-xs mt-1 tracking-tight font-sans">{errors.email.message}</p>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-4 text-sm hover:cursor-pointer bg-primary text-primary-foreground py-2 rounded-[6px] font-medium hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition font-sans"
                >
                    {isPending ? 'Sending...' : 'Send OTP'}
                </button>
            </form>
            <button className=" flex gap-2 justify-center items-center text-zinc-500 font-sans tracking-tight text-sm  px-4 hover:cursor-pointer"
                onClick={() => setReset(prev => !prev)}
            >
                <MoveLeft className="size-4" />
                Back to log in
            </button>
        </div>
    )
}