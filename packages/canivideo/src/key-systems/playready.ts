import {
  EncryptionScheme,
  KeySystemPlayReady,
  ResultDrm,
} from "../types";
import { isKeySystemSupported } from "./common";

type GetPlayreadyOptions = {
  contentType: string;
  keySystem: KeySystemPlayReady;
  encryption: EncryptionScheme;
};

export async function isPlayreadySupported({
  contentType,
  keySystem,
  encryption,
}: GetPlayreadyOptions): Promise<ResultDrm> {
  if (keySystem === "com.microsoft.playready") {
    // Legacy PlayReady can ignore the requested robustness.
    const supported = await isKeySystemSupported(
      keySystem,
      contentType,
      encryption,
    );

    return {
      keySystem,
      encryption,
      supported,
      securityLevels: [{ name: "unknown", label: "Unknown", supported }],
    };
  }

  const securityLevels = (
    await Promise.allSettled(
      ["3000", "2000", "150"].map(async (level) => {
        const supported = await isKeySystemSupported(
          keySystem,
          contentType,
          encryption,
          level,
        );
        return {
          name: level,
          label: `SL${level}`,
          supported,
        };
      }),
    )
  )
    .map((settled) => {
      if (settled.status === "rejected") {
        return;
      }
      return settled.value;
    })
    .filter((level) => level !== undefined);

  return {
    keySystem,
    encryption,
    supported: securityLevels.some((level) => level.supported),
    securityLevels,
  };
}
