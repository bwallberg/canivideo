import { getContentType, isCodecSupported } from "./codec";
import { isDrmSupported } from "./drm";
import { isManifestSupported } from "./manifest";
import { Container, Drm, Manifest,  Result } from "./types";

export * from "./types";

export async function canimanifest(manifest: Manifest): Promise<boolean> {
  return isManifestSupported(manifest);
}

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
    const api = isCodecSupported(options.container, codec);
    if (api.htmlVideoElement === false && api.mse === false) {
      result.codecs[codec] = {
        api,
        drm: [],
      }
      continue;
    }
    const drm = await Promise.all(
      options.drm.map(
        (drm) =>
          isDrmSupported(drm, getContentType(options.container, codec))
      )
    );
    result.codecs[codec] = {
      api,
      drm,
    };
  }

  return result;
}

export const isVideoSupported = canivideo;
