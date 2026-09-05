import ImageKit from "imagekit";
import { HttpError } from "./HttpError.js";

let client;

/**
 * Build the ImageKit client on first use rather than at import time.
 *
 * Constructing it eagerly threw during module load when the keys were absent,
 * which took the entire process down on start-up instead of failing only the
 * upload that needed it — and made every module that transitively imports this
 * one impossible to load in a test.
 */
const getClient = () => {
  if (client) return client;

  const publicKey = process.env.IMAGEKIT_PUBLICKEY;
  const privateKey = process.env.IMAGEKIT_PRIVATEKEY;
  const urlEndpoint = process.env.IMAGEKIT_URLENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new HttpError(503, "Image uploads are not configured on this server");
  }

  client = new ImageKit({ publicKey, privateKey, urlEndpoint });
  return client;
};

const imagekit = {
  upload: (options) => getClient().upload(options),
  deleteFile: (fileId) => getClient().deleteFile(fileId),
};

export default imagekit;
