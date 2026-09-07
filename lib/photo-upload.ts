import imageCompression from "browser-image-compression";

/**
 * Storage handler with client-side image compression
 */
export async function uploadPhoto(file: File, folder?: string): Promise<string> {
  try {
    const options = {
      maxSizeMB: 0.5, // 500KB max size
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    let processedFile = file;
    if (typeof window !== "undefined" && file.type.startsWith("image/")) {
      try {
        processedFile = await imageCompression(file, options);
      } catch (err) {
        console.warn("Image compression failed, using original file:", err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(processedFile);
    });
  } catch (e) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}

export async function uploadPhotos(
  files: File[],
  folder?: string,
  onProgress?: (done: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    urls.push(await uploadPhoto(files[i], folder));
    onProgress?.(i + 1, files.length);
  }
  return urls;
}