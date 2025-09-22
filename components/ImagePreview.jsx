export default function ImagePreview({ src }) {
    return (
        <div className="absolute z-[9999] invisible group-hover:visible bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg translate-y-full -translate-x-1/2 bottom-0 left-1/2 transform">
            <img
                src={src}
                alt="Preview"
                className="max-w-[200px] max-h-[200px] rounded"
            />
        </div>
    );
}
