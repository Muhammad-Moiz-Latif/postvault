import { RootState } from "@/state/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCommentAsync } from "../CommentsSlice";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700", "600", "500"],
  subsets: ["latin"],
});

export default function CommentSection({ PostId }: { PostId: string }) {
  const User = useSelector((state: RootState) => state.UserInfo.list);
  const comments = useSelector((state: RootState) => state.AllComments.list);
  const [area, setArea] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    //@ts-ignore
    dispatch(setCommentAsync({ PostId }));
    console.log(comments);
  }, [PostId, dispatch]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment = formData.get("text");

    const data = {
      comment,
      PostId,
      username: User.username,
    };
    try {
      const response = await axios.post("/api/features/addComment", data);
      if (response && response.status === 200) {
        //@ts-ignore
        dispatch(setCommentAsync({ PostId }));
        toast.success("Added Comment");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setArea(false);
      setValue("");
    }
  }

  function setDate(dateString: string) {
    const isoDate = dateString;
    const date = new Date(isoDate);

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
    return formatted;
  }

  return (
    <>
      <div
        className={`w-full px-44 py-28 border-t-[1px] border-sky-100 ${roboto.className}`}
      >
        <h1 className="text-2xl font-bold mb-8">{`Responses (${comments.length})`}</h1>
        <div className="flex gap-2 items-center">
          <img src={User.image} className="rounded-full size-8" />
          <h1>{User.username}</h1>
        </div>
        <form className="relative" onSubmit={handleSubmit}>
          <textarea
            placeholder="What are your thoughts?"
            className="bg-zinc-200 text-sm p-2 rounded-sm outline-none border-[1px] border-zinc-400 w-full mt-5 resize-none transition-all duration-500 ease-in-out"
            onClick={() => setArea(true)}
            style={{
              height: area ? "140px" : "40px", // animate height instead of rows
            }}
            name="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {area && (
            <div className="mt-3 flex justify-end gap-3 absolute right-2 bottom-4">
              <button
                onClick={() => {
                  setArea(false);
                  setValue("");
                }}
                className="text-sm py-2 transition-all duration-300 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-sm px-5 py-2 bg-zinc-300 hover:opacity-75 rounded-2xl transition-all duration-300 hover:cursor-pointer"
              >
                Comment
              </button>
            </div>
          )}
        </form>
        <div className="w-full h-[1px] bg-zinc-200 my-13"></div>
        {/* list the comments from different accounts here */}
        <div className="w-full">
          {comments && comments.length > 0
            ? comments.map((comment) => (
                <div
                  className="w-full flex flex-col gap-3 mb-5"
                  key={comment.id}
                >
                  <div className="flex gap-3 items-start justify-start">
                    <img src={comment.image} className="rounded-full size-8" />
                    <div className="flex flex-col">
                      <h1>{comment.username}</h1>
                      <h1 className="text-sm text-zinc-600 tracking-tight">
                        {setDate(comment.created_at)}
                      </h1>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-800">{comment.comment}</p>
                  <div className="w-full h-[1px] bg-zinc-200 my-6"></div>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}
