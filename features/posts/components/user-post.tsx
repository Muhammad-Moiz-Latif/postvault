import { RootState } from "@/state/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserPosts() {
  const userPosts = useSelector((state: RootState) => state.UserPosts.list);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const handleDeleteClick = (postId: number) => {
    setSelectedPost(postId);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;

    // 🔹 Call your delete API here
    console.log("Deleting post:", selectedPost);

    // Example:
    const result = await axios.delete(
      `/api/features/deleteBlog/${selectedPost}`,
    );
    console.log(result);
    // Close modal
    setModalOpen(false);
    setSelectedPost(null);
    toast.success("Post Deleted successfully"!);
    window.location.reload();
  };

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
                <Link
                  href={`edit-post/${post.id}`}
                  className="bg-amber-600 text-white px-3 py-1 rounded-md"
                >
                  Edit Post
                </Link>
                <button
                  onClick={() => handleDeleteClick(Number(post.id))}
                  className="bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>You have created no posts yet.</h1>
      )}

      {/* 🔹 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white p-6 rounded-xl shadow-xl z-10 w-96">
            <h2 className="text-lg font-bold mb-4">Delete this post?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
