import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import z from "zod"
import { useParams, useNavigate } from "react-router";
import { toast } from 'sonner';
import { useDetailedPost } from "../../posts/queries/useDetailedPost";
import { useEditPost } from "../queries/useEditPost";
import {
    ImagePlus,
    X,
    Save,
    Sparkles,
    ArrowLeft,
    Tag,
    FileText,
    Clock,
    CheckCircle2
} from "lucide-react";

const PostSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(60, "Title cannot be longer than 60 characters"),
    paragraph: z.string().min(20, "Paragraph must be at least 20 characters"),
    image: z.instanceof(FileList)
        .refine(files => files.length === 0 || files[0].size < 10_000_000, "Image must be less than 10MB")
        .refine(files => files.length === 0 || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0].type), "Only JPEG, PNG, GIF, and WEBP formats are supported")
        .optional(),
    tags: z.array(z.object({ value: z.string() })).min(1, "At least one tag is required").max(5, "Only 5 tags can be defined"),
    postId: z.string()
});

export type PostSchemaType = z.infer<typeof PostSchema>;

export const EditPost = () => {
    const params = useParams();
    const navigate = useNavigate();
    const postId = params.postId;
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [tagInput, setTagInput] = useState("");
    const { mutate: EditPost, isPending } = useEditPost(postId as string);
    const { data, isLoading } = useDetailedPost(postId as string);
    const post = data?.data;

    const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<PostSchemaType>({
        resolver: zodResolver(PostSchema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tags'
    });

    const profilePicture = watch("image");
    const title = watch("title");
    const paragraph = watch("paragraph");

    useEffect(() => {
        if (!profilePicture || profilePicture.length === 0) {
            setPreviewUrl("");
            return;
        }

        const file = profilePicture[0];
        const objectURL = URL.createObjectURL(file);
        setPreviewUrl(objectURL);

        return () => URL.revokeObjectURL(objectURL);
    }, [profilePicture]);

    useEffect(() => {
        if (!post) return;

        reset({
            title: post.title,
            paragraph: post.paragraph,
            tags: post.tags.map(tag => ({ value: tag })),
            postId: post.id,
        });

        setPreviewUrl(post.img);
    }, [post, reset]);

    const onSubmit: SubmitHandler<PostSchemaType> = (data) => {
        setErrorMessage("");
        EditPost(data, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success("Edits saved successfully!");
                    setPreviewUrl("");
                    reset();
                }
            },
            onError: (error: any) => {
                setErrorMessage("Could not save edits");
                console.error("Signup error in component:", error);
            }
        })
    };

    const handleAddTag = () => {
        const value = tagInput.trim();
        if (!value) return;
        if (fields.length >= 5) {
            toast.error("Maximum 5 tags allowed");
            return;
        }
        if (fields.some(field => field.value.toLowerCase() === value.toLowerCase())) {
            toast.error("Tag already exists");
            return;
        }

        append({ value });
        setTagInput("");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading your story...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header Bar */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40 px-3 py-2 rounded-full transition-all duration-200"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="flex items-center gap-3">
                        {post && (
                            <div className={`
                                inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-xs font-semibold ring-1
                                ${post.status === "PUBLISHED"
                                    ? "bg-green-100 text-green-700 ring-green-200"
                                    : "bg-amber-100 text-amber-700 ring-amber-200"
                                }
                            `}>
                                {post.status === "PUBLISHED" ? (
                                    <>
                                        <CheckCircle2 size={12} />
                                        Published
                                    </>
                                ) : (
                                    <>
                                        <Clock size={12} />
                                        Draft
                                    </>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            form="edit-post-form"
                            disabled={isPending || !post}
                            className="
                                inline-flex items-center gap-2 px-6 py-2.5 
                                bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-full
                                text-sm font-semibold
                                hover:shadow-lg hover:from-primary/90 hover:to-primary/80
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200
                            "
                        >
                            {isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    {post?.status === "PUBLISHED" ? (
                                        <>
                                            <Save size={16} />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            Publish Story
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {errorMessage && (
                    <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                        <X className="text-destructive mt-0.5 flex-shrink-0" size={18} />
                        <div>
                            <p className="text-sm font-semibold text-destructive mb-1">Error</p>
                            <p className="text-sm text-destructive/80">{errorMessage}</p>
                        </div>
                    </div>
                )}

                <form
                    id="edit-post-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-12"
                >
                    {/* Story Content */}
                    <div className="relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm p-10 space-y-10">

                        {/* Section Header */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileText size={18} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold tracking-wide text-foreground">
                                    Story Content
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Craft your narrative carefully
                                </p>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-4">
                            <textarea
                                {...register("title")}
                                rows={2}
                                className="
        w-full text-4xl md:text-5xl font-serif font-bold
        bg-transparent
        placeholder:text-muted-foreground/40
        focus:outline-none resize-none
        leading-tight
      "
                                placeholder="Your story title..."
                            />

                            <div className="flex items-center justify-between">
                                {errors.title ? (
                                    <p className="text-destructive text-xs font-medium flex items-center gap-1.5">
                                        <X size={14} />
                                        {errors.title.message}
                                    </p>
                                ) : (
                                    <div className="h-5" />
                                )}
                                <span className={`text-xs font-medium ${title?.length > 60 ? "text-destructive" :
                                    title?.length >= 50 ? "text-amber-500" :
                                        "text-muted-foreground"
                                    }`}>
                                    {title?.length || 0} / 60
                                </span>
                            </div>
                        </div>

                        {/* Paragraph */}
                        <div className="space-y-4">
                            <textarea
                                {...register("paragraph")}
                                rows={14}
                                className="
                                        w-full px-6 py-5
                                        bg-background
                                        border border-border/60
                                        rounded-2xl
                                        text-base font-sans leading-relaxed
                                        placeholder:text-muted-foreground/50
                                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40
                                        resize-none transition-all
                                    "
                                placeholder="Tell your story..."
                            />

                            {errors.paragraph ? (
                                <p className="text-destructive text-xs font-medium flex items-center gap-1.5">
                                    <X size={14} />
                                    {errors.paragraph.message}
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    {paragraph?.length || 0} characters
                                </p>
                            )}
                        </div>

                    </div>


                    {/* Divider */}
                    <div className="relative h-px bg-gradient-to-r from-transparent via-border to-transparent">
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-background">
                            <FileText className="text-muted-foreground" size={16} />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm p-10 space-y-6">

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <ImagePlus size={18} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Cover Image
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Make your story visually compelling
                                </p>
                            </div>
                        </div>

                        <label
                            htmlFor="cover-image"
                            className="
                            group relative block rounded-3xl overflow-hidden cursor-pointer
                            border-2 border-dashed border-border/50
                            hover:border-primary/60
                            bg-background transition-all duration-300
                            shadow-inner
                            "
                        >
                            {previewUrl ? (
                                <div className="relative h-80">
                                    <img
                                        src={previewUrl}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-semibold text-sm">
                                            Change cover image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center">
                                    <ImagePlus size={36} className="text-primary mb-3" />
                                    <p className="text-sm font-semibold text-foreground">
                                        Upload a cover image
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, GIF, WEBP • Max 10MB
                                    </p>
                                </div>
                            )}

                            <input
                                {...register("image")}
                                id="cover-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                            />
                        </label>

                        {errors.image && (
                            <p className="text-destructive text-xs font-medium flex items-center gap-1.5">
                                <X size={14} />
                                {errors.image.message}
                            </p>
                        )}

                    </div>


                    {/* Divider */}
                    <div className="relative h-px bg-gradient-to-r from-transparent via-border to-transparent">
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-background">
                            <Tag className="text-muted-foreground" size={16} />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm p-10 space-y-6">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Tag size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Tags
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Categorize your story
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                                {fields.length} / 5
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                disabled={fields.length >= 5}
                                className="
                                    flex-1 px-5 py-3
                                    bg-background
                                    border border-border/60
                                    rounded-full text-sm
                                    placeholder:text-muted-foreground/60
                                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40
                                    transition-all
                                "
                                placeholder="Add a tag..."
                            />

                            <button
                                type="button"
                                onClick={handleAddTag}
                                disabled={fields.length >= 5 || !tagInput.trim()}
                                className="
                                        px-6 py-3 rounded-full
                                        bg-primary text-primary-foreground
                                        text-sm font-semibold
                                        hover:bg-primary/90
                                        disabled:opacity-50
                                        transition-all
                                    "
                            >
                                Add
                            </button>
                        </div>

                        {fields.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="
            inline-flex items-center gap-2
            px-4 py-2
            bg-primary/10 text-primary
            rounded-full text-sm font-medium
          "
                                    >
                                        #{field.value}
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="hover:text-destructive transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.tags && (
                            <p className="text-destructive text-xs font-medium flex items-center gap-1.5">
                                <X size={14} />
                                {errors.tags.message}
                            </p>
                        )}

                    </div>


                    {/* Bottom Spacer for comfortable scrolling */}
                    <div className="h-20" />
                </form>
            </div>
        </div>
    );
};
