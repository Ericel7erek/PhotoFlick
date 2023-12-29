import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import EXIF from "exif-js";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function rotateImage(
  image: Blob | HTMLImageElement,
  orientation: number
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const imageElement = image instanceof Blob ? new Image() : image;

    if (image instanceof Blob) {
      imageElement.onload = () => {
        processImage();
      };

      imageElement.onerror = (error) => {
        reject(error);
      };

      imageElement.src = URL.createObjectURL(image);
    } else {
      processImage();
    }

    function processImage() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Unable to get 2D context"));
        return;
      }

      let width = imageElement.width;
      let height = imageElement.height;

      // Adjust width and height based on orientation
      if (orientation && orientation >= 5) {
        [width, height] = [height, width];
      }

      canvas.width = width;
      canvas.height = height;

      // Clear the canvas to avoid rendering issues
      ctx.clearRect(0, 0, width, height);

      // Apply rotation based on orientation
      switch (orientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, width, height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, height, width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, width);
          break;
      }

      // Draw the rotated image
      ctx.drawImage(imageElement, 0, 0, width, height);

      // Convert the canvas to a blob and resolve the URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            resolve(blobUrl);
          } else {
            reject(new Error("Error creating Blob from rotated image."));
          }
        },
        "image/jpeg",
        1 // Adjust quality if needed
      );
    }
  });
}

export async function readExifData(originalFile: File): Promise<any> {
  return new Promise<any>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(EXIF.readFromBinaryFile(reader.result as ArrayBuffer));
    reader.readAsArrayBuffer(originalFile);
  });
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
