import { Buffer } from "buffer";
import CryptoJS from "crypto-js";

export const getAuthToken = async (): Promise<string> =>
  (await chrome.identity.getAuthToken({ interactive: true })).token ?? "";

const encryptionKey = "4mm3k9ue34cQF5RhQUFsSKX98YJaGGHQgVjOfrNvCMw=";

export const EncodeStr = (str: string): string => {
  let out = "";
  try {
    out = CryptoJS.AES.encrypt(str, encryptionKey).toString();
  } catch (e) {
    console.log(e);
  }
  return Buffer.from(out).toString("base64");
};

export const DecodeStr = (str: string): string => {
  let out = "";
  try {
    const toB4 = Buffer.from(str, "base64").toString("ascii");
    out = CryptoJS.AES.decrypt(toB4, encryptionKey).toString(CryptoJS.enc.Utf8);
  } catch (e) {
    //
    console.log(e);
  }
  return out || "";
};
