import { isCodecSupportedMediaSource } from "./apis/media-source";
import { isCodecSupportedHtmlVideoElement } from "./apis/html";
import { Container, ResultApi } from "./types";
import { isCodecSupportedWebCodecs } from "./apis/web-codecs";

export function getContentType(container: Container, codec: string) {
  return `${container}; codecs="${codec}"`;
}

export async function isCodecSupported(
  container: Container,
  codec: string,
): Promise<ResultApi> {
  return {
    mse: isCodecSupportedMediaSource(container, codec),
    // "maybe" or "probably" are considered supported so we cast to boolean
    htmlVideoElement: isCodecSupportedHtmlVideoElement(container, codec),
    webCodecs: await isCodecSupportedWebCodecs(container, codec),
  };
}
