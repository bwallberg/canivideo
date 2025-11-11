import { getContentType } from "./codec";
import { isFairplaySupported } from "./key-systems/fairplay";
import { isPlayreadySupported } from "./key-systems/playready";
import { isWidevineSupported } from "./key-systems/widevine";
import { Drm } from "./types";

export function isDrmSupported(drm: Drm, contentType: string) {
  switch (drm.keySystem) {
    case "com.microsoft.playready.recommendation":
    case "com.microsoft.playready":
      return isPlayreadySupported({
        keySystem: drm.keySystem,
        encryption: drm.encryption,
        contentType,
      });
    case "com.apple.fps":
      return isFairplaySupported({
        contentType,
        encryption: drm.encryption,
      });
    case "com.widevine.alpha":
      return isWidevineSupported({
        contentType,
        encryption: drm.encryption,
      })
  }
}
