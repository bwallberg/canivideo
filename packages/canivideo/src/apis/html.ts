import { getContentType } from "../codec";

const htmlVideoElement = document.createElement("video");

export function isCodecSupportedHtmlVideoElement(
  container: string,
  codec: string,
) {
  return !!htmlVideoElement.canPlayType(getContentType(container, codec));
}
