import { getContentType, isCodecSupported } from "./codec";
import { isDrmSupported } from "./drm";
import { Container, Drm, EncryptionScheme, KeySystem, Result } from "./types";

export * from "./types";

type CanivideoOptions = {
  container: Container;
  drm: Drm[];
  codecs: string[];
  /**
   * Strict - if true all provided codecs must be supported for result.supported to be true
   */
  strict: boolean;
};

export async function canivideo(options: CanivideoOptions): Promise<Result> {
  const result: Result = {
    supported: false,
    codecs: {},
  };
  for (const codec of options.codecs) {
    const api = isCodecSupported(
      options.container,
      codec
    );
    const drm = await Promise.all(
      options.drm.map((drm) =>
        isDrmSupported(drm, getContentType(options.container, codec))
      )
    );
    result.codecs[codec] = {
      api,
      drm
    };
  }

  return result;
}

export const isVideoSupported = canivideo;
