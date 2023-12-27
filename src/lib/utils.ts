import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils.js

// Function to remove Exif orientation metadata from a File object
export const removeExifOrientation = async (file: File): Promise<File> => {
  return new Promise<File>((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Add null check for e.target
      if (e.target) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        const dv = new DataView(arrayBuffer);

        // Rest of the code remains unchanged
        // Check for the presence of Exif marker
        if (dv.getUint16(0, false) !== 0xffd8) {
          resolve(file); // No Exif data, no action needed
          return;
        }

        let offset = 2;

        while (offset < dv.byteLength) {
          const marker = dv.getUint16(offset, false);
          offset += 2;

          if (marker === 0xffe1) {
            // Found Exif marker
            const length = dv.getUint16(offset, false);
            offset += 2;

            // Check for "Exif" string
            if (dv.getUint32(offset, false) === 0x45786966) {
              offset += 6; // Skip "Exif\0\0"

              // Remove the orientation tag
              const orientationTagOffset = offset + 8;
              dv.setUint16(orientationTagOffset, 0, false);

              // Create a new File without the Exif orientation metadata
              const blob = new Blob([arrayBuffer], { type: file.type });
              const newFile = new File([blob], file.name, { type: file.type });

              resolve(newFile);
              return;
            }
          } else if ((marker & 0xff00) !== 0xff00) {
            break; // Not a valid marker
          } else {
            offset += dv.getUint16(offset, false);
          }
        }

        resolve(file); // No Exif data found or invalid structure
      }
    };

    reader.readAsArrayBuffer(file);
  });
};

// Other utility functions can be added to this module as needed

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

//
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
