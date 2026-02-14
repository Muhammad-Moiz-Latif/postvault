import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react"
import { useNavigate } from "react-router";
import { useState } from "react";

interface PostType {
    id: string;
    title: string;
    paragraph: string;
    img: string;
    createdAt: string;
    tags: Array<string>;
    author: {
        id: string;
        username: string;
        img: string;
    };
    commentcount: number;
    likecount: number;
}

export const PostCard = ({ post }: { post: PostType }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Format date relative or absolute
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            if (diffInHours < 1) return "Just now";
            return `${diffInHours}h ago`;
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
        });
    };

    // Calculate reading time (rough estimate: 200 words per minute)
    const calculateReadingTime = (text: string) => {
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    };

    const handleCardClick = () => {
        navigate(`/app/${post.id}`);
    };

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/app/profile/${post.author.id}`);
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsBookmarked(!isBookmarked);
        // TODO: API call to save bookmark
    };

    const handleMoreOptions = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Open dropdown menu
    };

    return (
        <article
            onClick={handleCardClick}
            className="group relative cursor-pointer rounded-2xl px-2 py-4 transition-all duration-200 hover:bg-muted/30"
        >
            {/* Author Row */}
            <div
                onClick={handleAuthorClick}
                className="flex items-center gap-3 mb-4"
            >
                <img
                    src={post.author.img}
                    alt={post.author.username}
                    className="size-7 rounded-full object-cover ring-2 ring-background"
                />

                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground hover:underline">
                        {post.author.username}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                        {formatDate(post.createdAt)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-8">
                {/* Text */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-semibold leading-snug tracking-tight text-foreground mb-3 group-hover:underline">
                        {post.title}
                    </h2>

                    <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-3 mb-6">
                        {post.paragraph}
                    </p>

                    {/* Meta Row */}
                    <div className="flex items-center justify-between">
                        {/* Tags + Reading */}
                        <div className="flex items-center gap-4 flex-wrap">
                            {post.tags?.slice(0, 2).map((tag, index) => (
                                <span
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/app/tag/${tag}`);
                                    }}
                                    className="px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground hover:bg-muted/80 transition"
                                >
                                    {tag}
                                </span>
                            ))}

                            <span className="text-xs text-muted-foreground">
                                {calculateReadingTime(post.paragraph)}
                            </span>
                        </div>

                        {/* Engagement */}
                        <div className="flex items-center gap-5 text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Heart className="size-4" strokeWidth={1.5} />
                                <span className="text-xs">{post.likecount}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <MessageCircle className="size-4" strokeWidth={1.5} />
                                <span className="text-xs">{post.commentcount}</span>
                            </div>

                            <button
                                onClick={handleBookmark}
                                className="p-2 rounded-full hover:bg-muted transition"
                            >
                                <Bookmark
                                    className={`size-4 ${isBookmarked ? "fill-foreground" : ""}`}
                                    strokeWidth={1.5}
                                />
                            </button>

                            <button
                                onClick={handleMoreOptions}
                                className="p-2 rounded-full hover:bg-muted transition"
                            >
                                <MoreHorizontal className="size-4" strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image */}
                {post.img && (
                    <div className="w-36 h-28 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img
                            src={post.img}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}
            </div>

            {/* Soft Separator */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-border/60 mt-8"></div>
        </article>
    );

};