import { EncryptionScheme, ResultDrm } from "../types";
import { isKeySystemSupported } from "./common";

type GetFairplayOptions = {
  contentType: string;
  encryption: EncryptionScheme;
};

export async function isFairplaySupported({
  contentType,
  encryption,
}: GetFairplayOptions): Promise<ResultDrm> {
  const supported = await isKeySystemSupported(
    "com.apple.fps",
    contentType,
    encryption,
  );

  return {
    keySystem: "com.apple.fps",
    encryption,
    supported,
    securityLevels: [],
  };
}
