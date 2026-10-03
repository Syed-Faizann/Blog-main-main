import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Fake auth function (replace with real auth later)
const auth = async (req) => {
  return { id: "fakeId" };
};

// FileRouter for your app
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete for userId:", metadata.userId);
      console.log("📁 File URL:", file.ufsUrl);

      // Return anything you want accessible on client after upload
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
};
