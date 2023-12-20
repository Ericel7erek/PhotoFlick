import { useCallback, useState } from "react";
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

            const file = acceptedFiles[0];
            const reader = new FileReader();

            reader.onloadend = function () {
                const exif = EXIF.readFromBinaryFile(new BinaryFile(reader.result));

                // Create a temporary canvas to handle image transformation
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');

                // Apply transformations based on exif.Orientation
                switch (exif.Orientation) {
                    case 2:
                        tempCanvas.width = file.width;
                        tempCanvas.height = file.height;
                        tempCtx.translate(tempCanvas.width, 0);
                        tempCtx.scale(-1, 1);
                        break;
                    case 3:
                        tempCanvas.width = file.width;
                        tempCanvas.height = file.height;
                        tempCtx.translate(tempCanvas.width, tempCanvas.height);
                        tempCtx.rotate(Math.PI);
                        break;
                    // Add cases for other orientations as needed
                    default:
                        // No transformation for other orientations
                        tempCanvas.width = file.width;
                        tempCanvas.height = file.height;
                        break;
                }

                // Draw the image on the temporary canvas
                tempCtx.drawImage(this.result, 0, 0);

                // Convert the temporary canvas to a data URL
                const transformedUrl = tempCanvas.toDataURL(file.type);

                // Set the transformed URL
                setFileUrl(transformedUrl);
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
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