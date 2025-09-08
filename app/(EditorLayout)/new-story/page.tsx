import BlockEditor from "@/components/BlockEditor"

export default function EditorPage({ setEditor }: { setEditor: (e: any) => void }){
    return(
        <>
            <div className="w-full h-screen pt-16">
                {/* <BlockEditor  onReady={setEditor}/> */}
            </div>
        </>
    )
}