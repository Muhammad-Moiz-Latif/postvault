// app/(editorLayout)/layout.tsx
"use client";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen">
      <main className="">{children}</main>
    </div>
  );
}
