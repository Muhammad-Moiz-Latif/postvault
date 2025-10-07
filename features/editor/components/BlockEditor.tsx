"use client";

import { useEffect, useMemo, useState } from "react";
import "@blocknote/mantine/style.css";

export default function BlockEditor({
  onReady,
  initialContent,
}: {
  onReady?: (editor: any) => void;
  initialContent?: any; // BlockNote JSON
}) {
  const [editorModule, setEditorModule] = useState<any>(null);

  // Dynamically import BlockNote modules
  useEffect(() => {
    (async () => {
      const mod = await import("@blocknote/react");
      const mantineMod = await import("@blocknote/mantine"); // optional if you need something from mantine
      setEditorModule(mod);
    })();
  }, []);

  // Memoize content
  const content = useMemo(
    () =>
      initialContent ?? [
        {
          id: "title-block",
          type: "heading",
          props: { level: 1 },
          content: [{ type: "text", text: "Add your title here...", styles: {} }],
        },
        {
          id: "body-block",
          type: "paragraph",
          content: [{ type: "text", text: "Start writing your story...", styles: {} }],
        },
      ],
    [initialContent]
  );

  if (!editorModule) return null; // wait until module loads

  const { useCreateBlockNote } = editorModule;
  const { BlockNoteView } = editorModule; // if you want, you can import mantine as separate dynamic import

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
