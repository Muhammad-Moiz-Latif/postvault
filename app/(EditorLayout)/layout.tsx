// DashboardLayout.tsx
"use client"

import EditorNav from "@/components/EditorNav"
import BlockEditor from "@/components/BlockEditor"
import { SessionProvider } from "next-auth/react"
import { useState } from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [editor, setEditor] = useState<any>(null)

    const handlePublish = async () => {
        if (!editor) return

        const json = editor.document

        // ✅ await the conversion
        const html = await editor.blocksToFullHTML(editor.document);

        console.log("JSON:", json)
        console.log("HTML:", html)

        // 👉 send json/html/markdown to your API here
    }

    return (
        <SessionProvider>
            <EditorNav onPublish={handlePublish} />
            <div className="w-full h-screen pt-16">
                <BlockEditor onReady={setEditor} />
            </div>
            {children}
        </SessionProvider>
    )
}

