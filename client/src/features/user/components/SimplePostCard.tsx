export function SimplePostCard({ post }: any) {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
            <h2 className="text-lg font-semibold">{post.title}</h2>

            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {post.paragraph}
            </p>

            <div className="text-xs text-gray-400 mt-3">
                Liked on {new Date(post.likedAt).toLocaleDateString()}
            </div>
        </div>
    );
}
