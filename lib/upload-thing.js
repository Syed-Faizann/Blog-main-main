import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import { ourFileRouter } from "@/app/api/uploadthing/core";

// Generate UploadThing components (no TypeScript generics in JS)
export const UploadButton = generateUploadButton(ourFileRouter);
export const UploadDropzone = generateUploadDropzone(ourFileRouter);
