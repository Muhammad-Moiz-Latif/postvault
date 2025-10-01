"use state";

import { RootState } from "@/state/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import clap from "../../../assets/clap.png";
import chat from "../../../assets/chat.png";

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
  const [Post, setPost] = useState<PostType>();

  useEffect(() => {
    AllPosts.forEach((post) => {
      if (post.id.toString() === PostId) {
        setPost(post);
      }
    });
  }, [AllPosts]);

  function setDate(dateString: string) {
    const isoDate = dateString;
    const date = new Date(isoDate);

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return formatted;
  }

  return (
    <>
      <div className="px-44 pt-20 w-full">
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
        <div className="w-full flex gap-10">
          <div className="flex items-center">
            <img src={clap.src} className="size-7 hover:cursor-pointer" />
            <h1 className="text-sm text-zinc-600">24K</h1>
          </div>
          <div className="flex items-center gap-2">
            <img src={chat.src} className="size-4 hover:cursor-pointer" />
            <h1 className="text-sm text-zinc-600">{AllComments.length}</h1>
          </div>
        </div>
        <div className="w-full h-[1px] bg-zinc-300 my-5"></div>
      </div>
    </>
  );
}
