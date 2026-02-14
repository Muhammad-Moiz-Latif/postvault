import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router"
import { useAuth } from "../../../../context/authContext";
import { toast, ToastContainer } from 'react-toastify';

export const GoogleSuccess = () => {
    const [searchParams] = useSearchParams();
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const access_token = searchParams.get('token');
        const userId = searchParams.get('userId');
        if (!access_token || !userId) {
            console.error("Could not log you in");
        } else {
            setAuth({
                access_token,
                user_id: userId
            });
            toast.success("Logged in successfully!");
            // Clean redirect - no token in URL
            setTimeout(() => {
                navigate('/app', { replace: true });
            }, 1500)
        };
    }, [searchParams]);

    return (
        <div className="flex items-center justify-center w-full backdrop-blur-3xl bg-white/50 min-h-screen absolute top-0">
            <ToastContainer
                position='top-center'
                closeOnClick
                draggable
                hideProgressBar={true}
            />
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing sign in...</p>
            </div>
        </div>
    )

}