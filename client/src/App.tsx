import { Outlet } from "react-router";
import { useAxiosInterceptors } from "./hooks/useAxiosInterceptors";

export default function App() {
  useAxiosInterceptors();

  return (
    <>
      <div className="w-screen min-h-screen">
        <Outlet/>
      </div>
    </>
  )
};
