export function PostCard({ post }: any) {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex gap-6 p-6">

            <img
                src={post.img}
                alt={post.title}
                className="w-40 h-28 object-cover rounded-xl"
            />

            <div className="flex-1">
                <h2 className="text-xl font-semibold">{post.title}</h2>

                <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                    {post.paragraph}
                </p>

                <div className="text-sm text-gray-400 mt-4">
                    By {post.author.username} •{" "}
                    {new Date(post.publishedAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
