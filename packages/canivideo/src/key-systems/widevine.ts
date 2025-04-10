import { EncryptionScheme, ResultDrm } from "../types";
import { isKeySystemSupported } from "./common";

type GetWidevineOptions = {
  contentType: string;
  encryption: EncryptionScheme;
};
export async function isWidevineSupported({
  contentType,
  encryption,
}: GetWidevineOptions): Promise<ResultDrm> {
  const supportedRobustness = (
    await Promise.all(
      ["HW_SECURE_ALL", "HW_SECURE_CRYPTO", "SW_SECURE_CRYPTO"].map(
        (robustness) =>
          isKeySystemSupported(
            "com.widevine.alpha",
            contentType,
            encryption,
            robustness,
          ).then((supported) => (supported ? robustness : null)),
      ),
    )
  ).filter((robustness) => !!robustness);

  return {
    keySystem: "com.widevine.alpha",
    encryption,
    supported: supportedRobustness.length > 0,
    securityLevels: [
      {
        name: "L1",
        supported: supportedRobustness.includes("HW_SECURE_ALL"),
      },
      {
        name: "L2",
        supported: supportedRobustness.includes("HW_SECURE_CRYPTO"),
      },
      {
        name: "L3",
        supported: supportedRobustness.includes("SW_SECURE_CRYPTO"),
      },
    ],
  };
}
