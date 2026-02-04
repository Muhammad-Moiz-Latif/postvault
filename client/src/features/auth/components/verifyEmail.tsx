import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "../components/ui/input-otp"
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useEmailVerify } from "../queries/useEmailVerify";
import { useNavigate } from "react-router";


export const VerifyEmail = ({ tokenId, setVerifyModal, setIsLogin }: { tokenId: string | null, setVerifyModal: React.Dispatch<React.SetStateAction<boolean>>, setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const { mutate, isPending } = useEmailVerify();

    async function handleClick() {
        mutate({ otp: value, tokenId }, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message);
                    setTimeout(() => {
                        setVerifyModal(false),
                            setIsLogin(true);
                        setValue("");
                        navigate('/auth');
                    }, 2000);
                };
            },
            onError: (error: any) => {
                setErrorMessage(error.response.data.message);
                toast.error(
                    error?.response?.data?.message ||
                    "Verification failed. Please try again."
                );
            }
        });
    };


    return (
        <div className="w-[40%] h-[50%] absolute border border-zinc-300 bg-white rounded-[10px] p-5 flex flex-col justify-evenly items-center">
            <ToastContainer />
            <h1 className="tracking-tight text-3xl font-medium">OTP Verification</h1>
            <p className="text-sm tracking-tight">Enter the otp sent to your personal email</p>
            {errorMessage && <h1 className="text-red-600">{errorMessage}</h1>}

            <InputOTP id="digits-only" maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={value}
                onChange={(e) => setValue(e)}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <button onClick={handleClick} className="bg-black w-24 h-8 rounded-[4px] text-white hover:cursor-pointer">{isPending ? "Verifying..." : "Verify"}</button>
        </div>
    )
};