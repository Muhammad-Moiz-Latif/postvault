"use client"

import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useEffect } from "react"

export default function BlockEditor({ onReady }: { onReady?: (editor: any) => void }) {
  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => URL.createObjectURL(file),
  })

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor)
    }
  }, [editor, onReady])

  return <BlockNoteView editor={editor} theme="light" />
}
