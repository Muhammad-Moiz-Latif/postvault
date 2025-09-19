import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

export default function UserPosts() {
  const userPosts = useSelector((state: RootState) => state.UserPosts.list);
  return (
    <>
      {userPosts && userPosts.length > 0 ? (
        <div>
          <h1 className="text-xl">Your Posts</h1>
          {userPosts.map((post) => (
            <div key={post.id} className="p-6 mb-6 rounded-xl shadow bg-white">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: post.html_content }}
              />
              <div className="flex gap-3">
                <button className="bg-amber-600 text-white px-3 py-1 rounded-md">
                  Edit Post
                </button>
                <button className="bg-red-600 text-black px-3 py-1 rounded-md">
                  Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>You have created no posts yet.</h1>
      )}
    </>
  );
}
