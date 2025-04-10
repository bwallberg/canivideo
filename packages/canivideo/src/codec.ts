import { Container } from "./types";

export function getContentType(container: Container, codec: string) {
  const isHls =
    container === "application/vnd.apple.mpegurl"

  // TODO: add support for providing correct container for HLS
  let type = isHls ? "video/mp4" : container;
  return `${type}; codecs="${codec}"`;
}

const htmlVideoElement = document.createElement("video");
export function isCodecSupported(container: Container, codec: string) {
  return {
    mse: window.MediaSource?.isTypeSupported(getContentType(container, codec)),
    htmlVideoElement: !!htmlVideoElement.canPlayType(
      getContentType(container, codec)
    ),
  };
}
