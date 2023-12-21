import { useCallback, useState, useEffect } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import EXIF from 'exif-js';

import { convertFileToUrl } from "@/lib/utils";

type ProfileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(convertFileToUrl(acceptedFiles[0]));
        },
        [fieldChange]
    );

    // Use effect to handle image orientation after drop
    useEffect(() => {
        const handleImageOrientation = async () => {
            if (file.length > 0) {
                const orientation = await getOrientation(file[0]);
                if (orientation !== 1) {
                    // If orientation is not normal (1), adjust the image
                    // Implement your image adjustment logic here
                    console.log(`Adjust image orientation: ${orientation}`);
                }
            }
        };

        handleImageOrientation();
    }, [file]);

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

// Function to get image orientation using exif-js
const getOrientation = async (file: File) => {
    return new Promise<number>((resolve) => {
        EXIF.getData(file, function (this: HTMLImageElement) {
            const orientation = EXIF.getTag(this, "Orientation");
            resolve(orientation || 1);
        });
    });
};

export default ProfileUploader;
