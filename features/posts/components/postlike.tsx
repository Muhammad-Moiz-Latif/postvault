"use client";

import { RootState } from "@/state/store";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clap from "../../../assets/clap.png";
import chat from "../../../assets/chat.png";
import { IncrementLikeAsync, setLikeAsync } from "../LikesSlice";

interface PostType {
  id: number;
  json_content: string;
  html_content: string;
  created_at: string;
  updated_at: string;
  username: string;
  image: string;
}

export default function Like({ PostId }: { PostId: string }) {
  const AllPosts = useSelector((state: RootState) => state.AllPost.list);
  const AllComments = useSelector((state: RootState) => state.AllComments.list);
  const AllLikes = useSelector((state: RootState) => state.AllLikes.list);
  const User = useSelector((state: RootState) => state.UserInfo.list);

  const [Post, setPost] = useState<PostType>();
  const [TotalClaps, setTotalClaps] = useState(0);
  const [UserLikes, setUserLikes] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    //@ts-ignore
    dispatch(setLikeAsync({ PostId }));
  }, [dispatch, PostId]);

  useEffect(() => {
    const total = AllLikes.reduce((sum, like) => sum + like.claps, 0);
    setTotalClaps(total);

    const userLike = AllLikes.find(
      (like) => like.user_id?.toString() === User.id?.toString(),
    );
    setUserLikes(userLike?.claps || 0);

    console.log("🔁 Updated likes:", AllLikes);
  }, [AllLikes, User.id]);

  useEffect(() => {
    const post = AllPosts.find((p) => p.id.toString() === PostId);
    if (post) setPost(post);
  }, [AllPosts, PostId]);

  function setDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  async function handleClick() {
    // ✅ Optimistic UI update
    setTotalClaps((prev) => prev + 1);
    setUserLikes((prev) => prev + 1);

    try {
      //@ts-ignore
      dispatch(IncrementLikeAsync({ UserId: User.id, PostId }));
      //@ts-ignore
      dispatch(setLikeAsync({ PostId })); // refresh likes after increment
    } catch (error) {
      console.error("Failed to increment:", error);
      setTotalClaps((prev) => prev - 1);
      setUserLikes((prev) => prev - 1);
    }
  }

  return (
    <div className="px-44 pt-20 w-full">
      {/* 🧑 Author + Date */}
      <div className="w-full flex gap-4 items-center">
        <img src={Post?.image} className="rounded-full size-8" />
        <h1>{Post?.username}</h1>
        <h1 className="text-sm text-zinc-600 tracking-tight">9 min read</h1>
        <h3 className="text-sm text-zinc-600 tracking-tight">-</h3>
        <h1 className="text-sm text-zinc-600 tracking-tight">
          {Post?.created_at && setDate(Post.created_at)}
        </h1>
      </div>

      <div className="w-full h-[1px] bg-zinc-200 my-5"></div>

      {/* 👏 Likes & 💬 Comments */}
      <div className="w-full flex gap-10">
        <div className="relative flex items-center">
          {/* 👏 User's personal claps */}
          {UserLikes > 0 && (
            <h1 className="absolute -top-5 left-[22px] bg-zinc-900 text-[10px] p-1 text-white rounded-full animate-bounce">
              +{UserLikes}
            </h1>
          )}
          <img
            src={clap.src}
            className="size-7 hover:cursor-pointer active:scale-95 transition-transform"
            onClick={handleClick}
          />
          <h1 className="text-sm text-zinc-600 ml-2">{TotalClaps}</h1>
        </div>

        <div className="flex items-center gap-2">
          <img src={chat.src} className="size-4 hover:cursor-pointer" />
          <h1 className="text-sm text-zinc-600">{AllComments.length}</h1>
        </div>
      </div>

      <div className="w-full h-[1px] bg-zinc-300 my-5"></div>
    </div>
  );
}
