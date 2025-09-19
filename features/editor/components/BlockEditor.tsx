"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo } from "react";

export default function BlockEditor({
  onReady,
  initialContent,
}: {
  onReady?: (editor: any) => void;
  initialContent?: any; // BlockNote JSON
}) {
  // 👇 If initialContent exists, use it. Otherwise, fall back to defaults
  const content = useMemo(
    () =>
      initialContent ?? [
        {
          id: "title-block",
          type: "heading",
          props: { level: 1 },
          content: [
            {
              type: "text",
              text: "Add your title here...",
              styles: {},
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
              styles: {},
            },
          ],
        },
      ],
    [initialContent],
  );

  const editor = useCreateBlockNote({
    initialContent: content,
    uploadFile: async (file: File) => URL.createObjectURL(file),
  });

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor);
    }
  }, [editor, onReady]);

  return <BlockNoteView editor={editor} theme="light" />;
}
