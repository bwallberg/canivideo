import { isCodecSupported } from "./codec";
import { Container, EncryptionScheme } from "./types";

export * from "./types";

const DefaultEncryptionsSchemes: EncryptionScheme[] = [
  "cenc",
  "cbcs",
  "cbcs-1-9",
];

type CanivideoOptions = {
  container: Container;
  codecs: string[];
  /**
   * Strict - if true all provided properties must be supported for result.supported to be true
   */
  strict: boolean;
};

export type Result = {
  supported: boolean;
  codecs: {
    [key: string]: {
      mse: boolean;
      htmlVideoElement: boolean;
    };
  };
};

export async function canivideo(options: CanivideoOptions): Promise<Result> {
  const result = {
    supported: false,
    codecs: {},
  };
  for (const codec of options.codecs) {
    const { mse, htmlVideoElement } = isCodecSupported(
      options.container,
      codec,
    );
    result.codecs[codec] = { mse, htmlVideoElement };
  }

  return result;
}

export const isVideoSupported = canivideo;
