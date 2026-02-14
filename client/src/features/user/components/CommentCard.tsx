export function CommentCard({ comment }: any) {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
            <p className="text-gray-700">{comment.text}</p>

            <div className="text-xs text-gray-400 mt-3">
                Liked on {new Date(comment.likedAt).toLocaleDateString()}
            </div>
        </div>
    );
}
