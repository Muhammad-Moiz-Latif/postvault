// src/layouts/MainLayout.tsx
import { Outlet, Link, useNavigate } from "react-router";
import { useAuth } from "../context/authContext";

export const MainLayout = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({ access_token: "" , user_id : ''});
        navigate('/');
    };

    return (
        <div className="w-screen min-h-screen flex flex-col bg-gray-50">
            {/* App Navbar - different from public navbar */}
            <nav className="bg-blue-600 text-white p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/app" className="text-2xl font-bold">
                        BlogApp
                    </Link>
                    
                    <div className="flex gap-6 items-center">
                        <Link to="/app" className="hover:text-blue-200">
                            Home
                        </Link>
                        <Link to="/app/blog" className="hover:text-blue-200">
                            All Posts
                        </Link>
                        <Link to="/app/create-post" className="hover:text-blue-200">
                            Create Post
                        </Link>
                        <Link to="/app/my-posts" className="hover:text-blue-200">
                            My Posts
                        </Link>
                        <Link to="/app/profile" className="hover:text-blue-200">
                            Profile
                        </Link>
                        
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main app content */}
            <main className="flex-1 container mx-auto p-6">
                <Outlet />
            </main>

            {/* App Footer */}
            <footer className="bg-gray-800 text-white p-4">
                <div className="container mx-auto text-center">
                    <p className="text-sm">Happy blogging! 📝</p>
                </div>
            </footer>
        </div>
    );
};