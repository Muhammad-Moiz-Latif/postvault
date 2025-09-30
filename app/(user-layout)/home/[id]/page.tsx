"use client";

import CommentSection from "@/features/posts/components/postcomment";
import { RootState } from "@/state/store";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface PostType {
  id: number;
  json_content: string;
  html_content: string;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const Posts = useSelector((state: RootState) => state.AllPost.list);
  const [Post, setPost] = useState<PostType>();

  useEffect(() => {
    Posts.forEach((post) => {
      if (post.id.toString() === id) {
        setPost(post);
      }
    });
  }, []);
  return (
    <>
      <div className="py-13 px-10">
        {" "}
        <div
          className="prose"
          //@ts-ignore
          dangerouslySetInnerHTML={{ __html: Post?.html_content }}
        />
        <CommentSection PostId={id} />
      </div>
    </>
  );
}
