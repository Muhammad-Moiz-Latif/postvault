"use client";

import Post from "@/features/posts/components/post-design";
import { setUserInfo } from "@/features/users/userInfoSlice";
import { RootState } from "@/state/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function Home() {
  const { data: session } = useSession();
  const PostsData = useSelector((state: RootState) => state.AllPost.list);
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
      <div className="py-13 px-10">
        <Post />
      </div>
    </>
  );
}
