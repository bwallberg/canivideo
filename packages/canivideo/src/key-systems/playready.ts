import {
  EncryptionScheme,
  KeySystem,
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
    .filter((level): level is ResultDrm["securityLevels"][number] => !!level);

  return {
    keySystem,
    encryption,
    supported: securityLevels.some((level) => level.supported),
    securityLevels,
  };
}
