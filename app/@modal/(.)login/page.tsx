"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function LoginPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal(); 
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-w-md w-full shadow-lg backdrop:bg-black/50"
    >
      <h2 className="text-lg font-semibold mb-2">PostVault Login</h2>
      <p className="text-sm text-gray-600 mb-4">
        This is a simple dialog box using the native dialog tag.
      </p>
      <form method="dialog">
        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>router.back()}>
          Close
        </button>
      </form>
    </dialog>
  );
}
