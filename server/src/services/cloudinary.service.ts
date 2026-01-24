import cloudinary from '../config/cloudinary';

export default function uploadImage(buffer: Buffer): Promise<string> {
    //manually created promise
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            //cloudinary metadata (will now store images in users folder in cloudinary)
            { folder: "users" },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload failed"));
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
}
