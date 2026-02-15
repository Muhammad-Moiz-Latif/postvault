import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
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

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
};

const readingTime = (text: string) => {
    return `${Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200))} min read`;
};

export const PostCard = ({ post, index = 0 }: { post: PostType; index?: number }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/app/profile/${post.author.id}`);
    };

    return (
        <article
            onClick={() => navigate(`/app/${post.id}`)}
            className="group cursor-pointer py-8 first:pt-0"
        >
            {/* Author Row */}
            <div onClick={handleAuthorClick} className="flex items-center gap-3 mb-4">
                <img
                    src={post.author.img}
                    alt={post.author.username}
                    className="size-6 rounded-full object-cover"
                />
                <div className="flex items-center gap-2 text-sm font-sans">
                    <span className="font-medium text-foreground hover:underline">{post.author.username}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{formatDate(post.createdAt)}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-6">
                <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-xl sm:text-2xl font-semibold leading-tight tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                        {post.title}
                    </h2>

                    <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2 mb-5 font-sans">
                        {post.paragraph}
                    </p>

                    {/* Meta Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-wrap">
                            {post.tags?.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/app/tag/${tag}`);
                                    }}
                                    className="px-3 py-1 rounded-full text-xs font-medium font-sans bg-sidebar-accent text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className="text-xs text-muted-foreground font-sans">
                                {readingTime(post.paragraph)}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Heart className="size-[15px]" strokeWidth={1.5} />
                                <span className="text-xs font-sans">{post.likecount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircle className="size-[15px]" strokeWidth={1.5} />
                                <span className="text-xs font-sans">{post.commentcount}</span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
                                className="p-1 rounded-full hover:bg-muted transition"
                            >
                                <Bookmark
                                    className={`size-[15px] ${isBookmarked ? "fill-foreground" : ""}`}
                                    strokeWidth={1.5}
                                />
                            </button>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded-full hover:bg-muted transition"
                            >
                                <MoreHorizontal className="size-[15px]" strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Thumbnail */}
                {post.img && (
                    <div className="hidden sm:block w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 mt-1">
                        <img
                            src={post.img}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-border mt-8" />
        </article>
    );
};
