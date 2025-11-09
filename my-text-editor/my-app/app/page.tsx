import Box from "@/components/description-box";

export default function Home() {
  return (
    <>
      <div className="w-full min-h-screen bg-cyan-50 flex justify-center items-center">
        <form className="w-full h-full flex flex-col gap-3 justify-center items-center">
          <input className="outline-none h-10 w-1/2 bg-zinc-200 rounded-md p-2" placeholder="Title" />
          <input className="outline-none h-10 w-1/2 bg-zinc-200 rounded-md p-2" placeholder="Sub-title" />
          <div className="w-full flex justify-center">
            <Box />
          </div>
          <div className="flex justify-center items-center bg-zinc-400 rounded-md w-1/2 h-40">
            Insert Image</div>
          <button className="h-10 w-1/3 bg-black text-white rounded-md">Create</button>
        </form>
      </div>
    </>
  )
}