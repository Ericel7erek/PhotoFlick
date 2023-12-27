import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { convertFileToUrl, convertHeicOrHeifToJpeg } from "@/lib/utils";

type ProfileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

    const onDrop = useCallback(
        async (acceptedFiles: FileWithPath[]) => {
            const selectedFile = acceptedFiles[0];

            try {
                // Check if the file is HEIC or HEIF
                if (selectedFile.type === 'image/heic' || selectedFile.type === 'image/heif') {
                    // Convert HEIC/HEIF to JPEG and handle orientation
                    const convertedFile = await convertHeicOrHeifToJpeg(selectedFile);
                    setFile([convertedFile]);
                    fieldChange([convertedFile]);
                    setFileUrl(convertFileToUrl(convertedFile));
                } else {
                    // For other file types, proceed as before
                    setFile(acceptedFiles);
                    fieldChange(acceptedFiles);
                    setFileUrl(convertFileToUrl(selectedFile));
                }
            } catch (error) {
                // Handle conversion errors
                console.error('Error handling file:', error);
            }
        },
        [file]
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
