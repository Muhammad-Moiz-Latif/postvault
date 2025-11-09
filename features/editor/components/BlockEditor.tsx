"use client";
import { useEffect, useMemo, useState } from "react";
import "@blocknote/mantine/style.css";

export default function BlockEditor({ onReady, initialContent }: any) {
  const [editorModule, setEditorModule] = useState<any>(null);

  useEffect(() => {
    import("@blocknote/react").then(setEditorModule);
  }, []);

  if (!editorModule) return <div>Loading editor...</div>;

  return (
    <BlockNoteEditorLoaded
      editorModule={editorModule}
      onReady={onReady}
      initialContent={initialContent}
    />
  );
}

function BlockNoteEditorLoaded({ editorModule, onReady, initialContent }: any) {
  // ✅ Handle both export styles (default / named)
  const mod = editorModule.default || editorModule;
  const { useCreateBlockNote, BlockNoteView } = mod;

  if (!useCreateBlockNote || !BlockNoteView)
    return <div>Editor module not ready...</div>;

  const content = useMemo(
    () =>
      initialContent ?? [
        {
          id: "title-block",
          type: "heading",
          props: { level: 1 },
          content: [
            { type: "text", text: "Add your title here...", styles: {} },
          ],
        },
        {
          id: "body-block",
          type: "paragraph",
          content: [
            { type: "text", text: "Start writing your story...", styles: {} },
          ],
        },
      ],
    [initialContent]
  );

  const editor = useCreateBlockNote({
    initialContent: content,
    uploadFile: async (file: File) => URL.createObjectURL(file),
  });

  useEffect(() => {
    if (editor && onReady) onReady(editor);
  }, [editor, onReady]);

  return <BlockNoteView editor={editor} theme="light" />;
}
