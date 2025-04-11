import { Container } from "./types";

export function getContentType(container: Container, codec: string) {
  return `${container}; codecs="${codec}"`;
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
