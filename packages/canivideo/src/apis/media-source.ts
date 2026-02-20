import { getContentType } from "../codec";
import { Container } from "../types";

export function isCodecSupportedMediaSource(
  container: Container,
  codec: string,
) {
  return window.MediaSource?.isTypeSupported(getContentType(container, codec));
}
