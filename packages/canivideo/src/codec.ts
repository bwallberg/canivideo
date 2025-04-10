import { Container } from "./types";

const htmlVideoElement = document.createElement("video");
export function isCodecSupported(container: Container, codec: string) {
  return {
    mse: window.MediaSource?.isTypeSupported(`${container}; codecs="${codec}"`),
    htmlVideoElement: !!htmlVideoElement.canPlayType(
      `${container}; codecs="${codec}"`,
    ),
  };
}
