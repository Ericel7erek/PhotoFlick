import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { convertFileToUrl } from "@/lib/utils";

// Import the removeExifOrientation function
import { removeExifOrientation } from "@/lib/utils";

type ProfileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

    // Function to handle Exif orientation before uploading
    const handleUpload = async (file: File) => {
        // Remove Exif orientation metadata before uploading
        const fileWithoutExif = await removeExifOrientation(file);

        // Now you can proceed with uploading fileWithoutExif
        // Your actual upload logic goes here
        // ...

        // For now, let's log the modified file URL
        console.log("File URL after removing Exif orientation:", convertFileToUrl(fileWithoutExif));
    };

    const onDrop = useCallback(
        async (acceptedFiles: FileWithPath[]) => {
            const selectedFile = acceptedFiles[0];

            // Handle Exif orientation before uploading
            await handleUpload(selectedFile);

            // Rest of your logic goes here
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(convertFileToUrl(acceptedFiles[0]));
        },
        [file, fieldChange]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg"],
        },
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} className="cursor-pointer" />

            <div className="cursor-pointer flex-center gap-4">
                <img
                    src={fileUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="image"
                    className="h-24 w-24 rounded-full object-cover object-top"
                />
                <p className="text-primary-500 small-regular md:bbase-semibold">
                    Change profile photo
                </p>
            </div>
        </div>
    );
};

export default ProfileUploader;
