import { EncryptionScheme, KeySystem } from "../types";

export function isKeySystemSupported(
  keySystem: KeySystem,
  contentType: string,
  encryption: EncryptionScheme,
  robustness: string = "",
): Promise<boolean> {
  if (navigator.requestMediaKeySystemAccess) {
    return navigator
      .requestMediaKeySystemAccess(keySystem, [
        {
          initDataTypes: ['cenc', 'sinf', 'skd', 'keyids'],
          videoCapabilities: [
            {
              contentType,
              robustness,
              encryptionScheme: encryption,
            },
          ],
        },
      ])
      .then((access) => access.createMediaKeys())
      .then(() => true)
      .catch(() => false);
  } else {
    return Promise.resolve(false);
  }
}
