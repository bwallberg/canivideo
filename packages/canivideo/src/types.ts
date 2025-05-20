export type Container =
  | "video/mp4"
  | "audio/mp4"
  | "video/webm"
  | "application/vnd.apple.mpegurl"
  | string;

export type KeySystemPlayReady =
  | "com.microsoft.playready"
  | "com.microsoft.playready.recommendation";

export type KeySystem =
  | "com.widevine.alpha"
  | "com.apple.fps"
  | KeySystemPlayReady;

export type EncryptionScheme = "cenc" | "cbcs" | "cbcs-1-9";

export type Drm = {
  keySystem: KeySystem;
  encryption: EncryptionScheme;
};

export type ResultDrm = {
  keySystem: KeySystem;
  supported: boolean;
  securityLevels: {
    name: string;
    supported: boolean;
  }[];
};

export type ResultApi = {
  mse: boolean;
  htmlVideoElement: boolean;
};

export type Result = {
  supported: boolean;
  codecs: {
    [key: string]: {
      api: ResultApi;
      drm: ResultDrm[];
    };
  };
};
