"use client"

import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useEffect } from "react"

export default function BlockEditor({ onReady }: { onReady?: (editor: any) => void }) {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        id: "title-block",
        type: "heading",
        props: { level: 1 },
        content: [
          {
            type: "text",
            text: "Add your title here...",
            styles: {}, // 👈 required
          },
        ],
      },
      {
        id: "body-block",
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Start writing your story...",
            styles: {}, // 👈 required
          },
        ],
      },
    ],
    uploadFile: async (file: File) => URL.createObjectURL(file),
  })


  useEffect(() => {
    if (editor && onReady) {
      onReady(editor)
    }
  }, [editor, onReady])

  return <BlockNoteView editor={editor} theme="light" />
}
