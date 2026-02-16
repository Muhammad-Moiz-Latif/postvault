export const EditorialPanel = ({ bg }: { bg: string }) => {
    return (
        <div className="relative flex-1 m-2 overflow-hidden rounded-2xl border border-primary/20">

            {/* BACK IMAGE */}
            <img
                src={bg}
                className="absolute inset-0 w-full h-full object-cover scale-110 opacity-70"
            />

            {/* FLORAL / PAPER TEXTURE */}
            <div className="absolute inset-0 bg-[url('/paper-noise.png')] opacity-[0.04] mix-blend-soft-light" />

            {/* RADIAL LIGHT ATMOSPHERE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,200,120,0.18),transparent_60%)]" />

            {/* CENTER WARM GLOW */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_55%,rgba(255,180,80,0.12),transparent_70%)]" />


            {/* TIMELINE STRIPE */}
            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-primary via-primary/50 to-transparent">
            </div>

            {/* BIG ENGRAVED LETTER */}
            <span className="
        absolute -right-16 -bottom-20
        font-serif text-[28rem] font-bold
        text-primary/10
        blur-[1px]
        mix-blend-overlay
        select-none pointer-events-none
      ">
                P
            </span>

            {/* QUOTE CONTENT */}
            <div className="relative z-10 flex flex-col justify-end h-full p-10">

                <h1 className="font-serif text-6xl tracking-tight text-primary leading-16 animate-fadeUp">
                    Every story
                    <br />
                    <span className="text-primary relative inline-block">
                        begins with
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/60 scale-x-0 animate-lineReveal origin-left" />
                    </span>
                    <br />
                    a single word.
                </h1>

                <p className="mt-4 text-sm tracking-tighter text-muted-foreground max-w-xs animate-fadeUp delay-200">
                    A calm place for your thoughts to take shape.
                </p>

            </div>
        </div>
    )
};
