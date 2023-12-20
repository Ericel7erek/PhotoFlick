import { useCallback, useState, useEffect } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import EXIF from "exif-js"; // Import the exif-js library
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
        [file]
    );

    const handleOrientation = (file: File) => {
        EXIF.getData(file, function () {
            const orientation = EXIF.getTag(this, "Orientation");
            if (orientation && orientation !== 1) {
                // Image needs rotation, handle rotation here
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();

                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Rotate image
                    switch (orientation) {
                        case 2:
                            ctx?.transform(-1, 0, 0, 1, img.width, 0);
                            break;
                        case 3:
                            ctx?.transform(-1, 0, 0, -1, img.width, img.height);
                            break;
                        case 4:
                            ctx?.transform(1, 0, 0, -1, 0, img.height);
                            break;
                        case 5:
                            ctx?.transform(0, 1, 1, 0, 0, 0);
                            break;
                        case 6:
                            ctx?.transform(0, 1, -1, 0, img.height, 0);
                            break;
                        case 7:
                            ctx?.transform(0, -1, -1, 0, img.height, img.width);
                            break;
                        case 8:
                            ctx?.transform(0, -1, 1, 0, 0, img.width);
                            break;
                        default:
                            break;
                    }

                    // Draw the image on the canvas
                    ctx?.drawImage(img, 0, 0);
                    const rotatedUrl = canvas.toDataURL("image/jpeg");
                    setFileUrl(rotatedUrl);
                };

                img.src = URL.createObjectURL(file);
            }
        });
    };

    useEffect(() => {
        if (file.length > 0) {
            handleOrientation(file[0]);
        }
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

export default ProfileUploader;
