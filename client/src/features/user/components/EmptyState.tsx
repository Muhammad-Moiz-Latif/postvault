export function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-400">{message}</p>
        </div>
    );
}
