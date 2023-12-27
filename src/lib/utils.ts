import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import heic2any from "heic2any";

export const convertHeicOrHeifToJpeg = async (file: File): Promise<File> => {
  try {
    const blobs = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 1, // Adjust the quality as needed
    });

    // If blobs is an array, create a new Blob from the array
    const convertedBlob = Array.isArray(blobs)
      ? new Blob(blobs, { type: "image/jpeg" })
      : blobs;

    // Create a new File object from the converted blob
    const convertedFile = new File([convertedBlob], "converted.jpg", {
      type: "image/jpeg",
    });

    return convertedFile;
  } catch (error) {
    console.error("Error converting HEIC/HEIF to JPEG:", error);
    throw error;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
