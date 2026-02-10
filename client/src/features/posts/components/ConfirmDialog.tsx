export const ConfirmDialog = ({
  onSave,
  onCancel,
  onDiscard,
  isPending
}: {
  onSave: () => void;
  onCancel: () => void;
  onDiscard: () => void;
  isPending: boolean
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          Unsaved Changes
        </h2>
        <p className="text-gray-600 mb-6">
          You have unsaved changes. Save as draft before leaving?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            {isPending ? "Saving Draft..." : "Save Draft"}
          </button>
        </div>
      </div>
    </div>
  );
};