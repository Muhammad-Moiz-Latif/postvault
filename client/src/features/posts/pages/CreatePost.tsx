import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import z from "zod"
import { useBlocker, useNavigate } from "react-router";
import { useDraftPost } from "../queries/useDraftPost";
import { toast } from 'sonner';
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { usePublishPost } from "../queries/usePublishPost";
import { ArrowLeft, Loader2, Tag, X } from "lucide-react";

const PostSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(60, "Title cannot be longer than 60 characters"),
    paragraph: z.string().min(20, "Paragraph must be at least 20 characters"),
    image: z.instanceof(FileList)
        .refine(files => files.length > 0, "Please select an image for your post")
        .refine(files => files.length > 0 && files[0].size < 10_000_000, "Image must be less than 10MB")
        .refine(files => files.length > 0 && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0].type), "Only JPEG, PNG, GIF, and WEBP formats are supported"),
    tags: z.array(z.object({ value: z.string() })).min(1, "At least one tag is required").max(5, "Only 5 tags can be defined")
});

export type PostSchemaType = z.infer<typeof PostSchema>;

export const CreatePost = () => {
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();
    const { mutate: PublishPost, isPending } = usePublishPost();
    const { mutate: SaveDraft, isPending: DraftPending } = useDraftPost();
    const navigate = useNavigate();
    const { register, handleSubmit, control, reset, getValues, formState: { errors, isDirty }, watch } = useForm<PostSchemaType>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            title: "",
            paragraph: "",
            tags: []
        }
    });

    // Watch form values to check if there's actual content
    const formValues = watch();

    const hasContent = () => {
        return (
            (formValues.title && formValues.title.trim().length > 0) ||
            (formValues.paragraph && formValues.paragraph.trim().length > 0) ||
            (formValues.image && formValues.image.length > 0) ||
            (formValues.tags && formValues.tags.length > 0)
        );
    };

    const blocker = useBlocker(
        isDirty && hasContent()
    );


    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tags'
    });

    const profilePicture = watch("image");

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

    const onSubmit: SubmitHandler<PostSchemaType> = (data) => {
        setErrorMessage(""); // Clear previous errors
        PublishPost(data, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message);
                    queryClient.invalidateQueries({ queryKey: ["all-posts"] });
                    setPreviewUrl("");
                    reset();
                }
            },
            onError: (error: any) => {
                setErrorMessage(error.response.data.message);
                console.error("Signup error in component:", error);
            }
        })
    };

    function onSave() {
        const currentFormData = getValues();
        SaveDraft(currentFormData, {
            onSuccess: (response) => {
                if (response.success) {
                    blocker.proceed?.();
                }
            },
            onError: (error: any) => {
                toast.error('Failed to save draft');
                console.error("Signup error in component:", error.response.data.message);
            }
        })
    };

    function onCancel() {
        blocker.reset?.();
    };

    function onDiscard() {
        blocker.proceed?.();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <div className="border-b border-border/50 sticky top-0 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-sm z-20">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 px-3 py-2 rounded-full transition-all duration-200"
                    >
                        <ArrowLeft size={16} />
                        <span className="font-sans">Back</span>
                    </button>

                    <button
                        type="submit"
                        form="post-form"
                        disabled={isPending}
                        className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-background rounded-full text-sm font-semibold font-sans hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            "Publish Post"
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto">
                <div className="p-8 md:p-12">

                    {/* Error */}
                    {errorMessage && (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 backdrop-blur-sm">
                            <p className="text-sm text-destructive font-sans">{errorMessage}</p>
                        </div>
                    )}

                    <form
                        id="post-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-14"
                    >

                        {/* SECTION: COVER IMAGE */}
                        <div className="space-y-4">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                                Cover Image
                            </p>

                            <label
                                htmlFor="profile-picture"
                                className="group block border-2 border-dashed border-border/60 rounded-2xl hover:border-primary/40 transition-all duration-200 cursor-pointer overflow-hidden"
                            >
                                <div className="h-72 flex items-center justify-center bg-card group-hover:bg-card/80 transition-colors">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div className="text-center text-muted-foreground px-6">
                                            <p className="text-sm font-medium font-sans">
                                                Click to upload cover image
                                            </p>
                                            <p className="text-xs mt-2 font-sans">
                                                PNG, JPG, GIF, WEBP up to 10MB
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <input
                                    {...register("image")}
                                    id="profile-picture"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>

                            {errors.image && (
                                <p className="text-xs text-destructive font-sans">
                                    {errors.image.message}
                                </p>
                            )}
                        </div>

                        {/* SECTION: POST DETAILS */}
                        <div className="space-y-10">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                                Post Details
                            </p>

                            {/* Title */}
                            <div className="space-y-2">
                                <input
                                    {...register("title")}
                                    placeholder="Title"
                                    className="w-full text-4xl md:text-5xl font-serif font-bold bg-card border border-border/50 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all hover:border-border/80"
                                />
                                {errors.title && (
                                    <p className="text-xs text-destructive font-sans">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Paragraph */}
                            <div className="space-y-2">
                                <textarea
                                    rows={14}
                                    {...register("paragraph")}
                                    placeholder="Tell your story..."
                                    className="w-full text-lg leading-relaxed bg-card border border-border/50 px-5 py-5 rounded-xl outline-none resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-sans hover:border-border/80"
                                />
                                {errors.paragraph && (
                                    <p className="text-xs text-destructive font-sans">
                                        {errors.paragraph.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative h-px bg-gradient-to-r from-transparent via-border to-transparent">
                            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-background">
                                <Tag className="text-muted-foreground" size={16} />
                            </div>
                        </div>
                        {/* SECTION: TAGS */}
                        <div className="space-y-6">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                                Categorization
                            </p>

                            <input
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const value = e.currentTarget.value.trim();
                                        if (!value) return;
                                        if (fields.length >= 5) return;
                                        append({ value });
                                        e.currentTarget.value = "";
                                    }
                                }}
                                placeholder="Type a tag and press Enter"
                                className="w-full px-5 py-4 border border-border/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card transition-all font-sans hover:border-border/80"
                            />

                            {fields.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="flex items-center gap-2 px-3.5 py-2 bg-accent text-foreground rounded-full text-sm font-sans ring-1 ring-primary/20"
                                        >
                                            <span>{field.value}</span>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.tags && (
                                <p className="text-xs text-destructive font-sans">
                                    {errors.tags.message}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {blocker.state === "blocked" && (
                <ConfirmDialog
                    onSave={onSave}
                    onCancel={onCancel}
                    onDiscard={onDiscard}
                    isPending={DraftPending}
                />
            )}
        </div>
    );


};

