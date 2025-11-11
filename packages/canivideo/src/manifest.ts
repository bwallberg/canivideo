import { Manifest } from "./types";

const htmlVideoElement = document.createElement("video");
export function isManifestSupported(manifest: Manifest) {
  // "maybe" or "probably" are considered supported so we cast to boolean
  return !!htmlVideoElement.canPlayType(manifest);
}
