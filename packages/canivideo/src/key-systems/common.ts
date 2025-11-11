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
          initDataTypes: ['cenc', 'sinf' , 'skd', 'keyids'],
          // TODO: have a more robust way of determining video vs audio capabilities
          videoCapabilities: contentType.includes("video/") ? [
            {
              contentType,
              robustness,
              encryptionScheme: encryption,
            },
          ] : undefined,
          audioCapabilities: contentType.includes("audio/") ? [
            {
              contentType,
              robustness,
              encryptionScheme: encryption,
            },
          ] : undefined,
        },
      ])
      .then((access) => access.createMediaKeys())
      .then(() => true)
      .catch(() => false);
  } else {
    return Promise.resolve(false);
  }
}
