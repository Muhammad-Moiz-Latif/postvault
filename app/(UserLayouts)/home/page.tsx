"use client";

import { setUserInfo } from "@/state/features/userInfoSlice";
import { RootState } from "@/state/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function Home() {
  const { data: session } = useSession();
  const PostsData = useSelector((state: RootState) => state.setPost.list);
  console.log(PostsData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUserInfo({
          username: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }),
      );
    }
  }, [session]);

  return (
    <>
      <div className="py-16 px-10">
        {PostsData && PostsData.length > 0 ? (
          PostsData.map((posts) => (
            <div key={posts.id} className="p-6 mb-6 rounded-xl shadow bg-white">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: posts.html_content }}
              />
            </div>
          ))
        ) : (
          <div>Feed is empty</div>
        )}
      </div>
    </>
  );
}
