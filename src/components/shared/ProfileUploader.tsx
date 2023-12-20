import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import EXIF from "exif-js";
import { convertFileToUrl } from "@/lib/utils";

// Add the BinaryFile declaration here
declare class BinaryFile {
    constructor(data: ArrayBuffer);
    readonly data: ArrayBuffer;
    readonly asDataView: DataView;
    readonly asBinaryString: string;
    readonly asArrayBuffer: ArrayBuffer;
}

type ProfileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            // Assuming only one file is dropped
            const droppedFile = acceptedFiles[0];

            const fileReader = new FileReader();
            fileReader.onloadend = function (event) {
                const result = event.target?.result; // Type of result is 'string | ArrayBuffer | null'

                if (result instanceof ArrayBuffer) {
                    const exif = EXIF.readFromBinaryFile(new BinaryFile(result));

                    // Your EXIF orientation switch logic
                    switch (exif.Orientation) {
                        case 8:
                            // Rotate 90 degrees
                            break;
                        case 3:
                            // Rotate 180 degrees
                            break;
                        case 6:
                            // Rotate -90 degrees
                            break;
                        // Add more cases if needed
                    }

                    // Continue with your existing logic
                    // For example, you might want to upload the rotated file or display it.
                    setFile(acceptedFiles);
                    fieldChange(acceptedFiles);
                    setFileUrl(convertFileToUrl(droppedFile));
                } else {
                    console.error("FileReader onloadend: Unexpected result type");
                }
            };

            // Start reading the file as an ArrayBuffer
            fileReader.readAsArrayBuffer(droppedFile);
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
