export enum DrmType {
  WIDEVINE,
  PLAYREADY,
  PLAYREADY_LEGACY,
  FAIRPLAY,
}

export enum KeySystem {
  WIDEVINE = "com.widevine.alpha",
  PLAYREADY_LEGACY = "com.microsoft.playready",
  PLAYREADY = "com.microsoft.playready.recommendation",
  FAIRPLAY = "com.apple.fps",
}

type HDCP_VERSION =
  | "1.0"
  | "1.1"
  | "1.2"
  | "1.3"
  | "1.4"
  | "2.0"
  | "2.1"
  | "2.2"
  | "2.3";

const HDCP_VERSIONS: HDCP_VERSION[] = [
  "1.0",
  "1.1",
  "1.2",
  "1.3",
  "1.4",
  "2.0",
  "2.1",
  "2.2",
  "2.3",
];

export const KeySystemDrmTypeMap = {
  [KeySystem.WIDEVINE]: DrmType.WIDEVINE,
  [KeySystem.PLAYREADY_LEGACY]: DrmType.PLAYREADY_LEGACY,
  [KeySystem.PLAYREADY]: DrmType.PLAYREADY,
  [KeySystem.FAIRPLAY]: DrmType.FAIRPLAY,
};

export const NameMap = {
  [DrmType.WIDEVINE]: "Google Widevine",
  [DrmType.PLAYREADY_LEGACY]: "Microsoft PlayReady Legacy",
  [DrmType.PLAYREADY]: "Microsoft PlayReady",
  [DrmType.FAIRPLAY]: "Apple FairPlay",
};

type EncryptionScheme = "cenc" | "cbcs" | "cbcs-1-9";

const EncryptionSchemes: EncryptionScheme[] = ["cenc", "cbcs", "cbcs-1-9"];

export type SecurityLevel = {
  name: string;
  supported: boolean;
};

export type SupportedEncryption = {
  name: EncryptionScheme;
  supported: boolean;
};

export interface IDrm {
  type: DrmType;
  keySystem: KeySystem;
  supportedEncryptions: SupportedEncryption[];
  securityLevels: SecurityLevel[];
  hdcpSupport: string;
}

function isMinHdcpVersionSupported(
  mediaKeys: MediaKeys,
  minHdcpVersion: HDCP_VERSION
): Promise<string> {
  if (!("getStatusForPolicy" in mediaKeys)) {
    return Promise.resolve("unknown");
  }

  // @ts-ignore
  return mediaKeys
    .getStatusForPolicy({ minHdcpVersion })
    .catch(() => "unsupported");
}

function isKeySystemSupported(
  keySystem: KeySystem,
  contentType: string,
  initDataType: EncryptionScheme,
  robustness: string = ""
) {
  if (navigator.requestMediaKeySystemAccess) {
    return navigator
      .requestMediaKeySystemAccess(keySystem, [
        {
          initDataTypes: [initDataType],
          videoCapabilities: [
            {
              contentType,
              robustness,
            },
          ],
        },
      ])
      .then((access) => access.createMediaKeys())
      .then(async (mediaKeys) => ({
        supported: true,
        hdcpSupport: await Promise.all(
          HDCP_VERSIONS.map(
            async (version) =>
              await isMinHdcpVersionSupported(mediaKeys, version).then(
                (result) => `${version}: ${result}`
              )
          )
        ),
      }))
      .catch(() => ({ supported: false, hdcpSupport: [] }));
  } else {
    return Promise.reject();
  }
}

async function getWidevine(contentType: string): Promise<IDrm> {
  const supportedRobustness = (
    await Promise.all(
      [
        "HW_SECURE_ALL",
        "HW_SECURE_DECODE",
        "HW_SECURE_CRYPTO",
        "SW_SECURE_DECODE",
        "SW_SECURE_CRYPTO",
      ].map((robustness) =>
        isKeySystemSupported(
          KeySystem.WIDEVINE,
          contentType,
          "cenc",
          robustness
        ).then(({ supported }) => (supported ? robustness : null))
      )
    )
  ).filter((robustness) => !!robustness);

  const supportedEncryptions = await Promise.all(
    EncryptionSchemes.map(async (encryption) => ({
      name: encryption,
      supported: (
        await isKeySystemSupported(KeySystem.WIDEVINE, contentType, encryption)
      ).supported,
    }))
  );

  const hdcpSupport = (
    await isKeySystemSupported(KeySystem.WIDEVINE, contentType, "cenc").then(
      ({ hdcpSupport }) => hdcpSupport
    )
  ).join(",");
  
  console.log("bwallberg", hdcpSupport)

  return {
    type: DrmType.WIDEVINE,
    keySystem: KeySystem.WIDEVINE,
    supportedEncryptions,
    hdcpSupport,
    securityLevels: [
      {
        name: "L1",
        supported: supportedRobustness.includes("HW_SECURE_ALL"),
      },
      {
        name: "L2",
        supported: supportedRobustness.includes("HW_SECURE_CRYPTO"),
      },
      {
        name: "L3",
        supported: supportedRobustness.includes("SW_SECURE_CRYPTO"),
      },
    ],
  };
}

async function getPlayready(
  contentType: string,
  keySystem: KeySystem.PLAYREADY | KeySystem.PLAYREADY_LEGACY
): Promise<IDrm> {
  const securityLevels: SecurityLevel[] = [];
  const promises: Promise<any>[] = [];
  ["3000", "2000", "150"].forEach((level) => {
    const promise = isKeySystemSupported(
      keySystem,
      contentType,
      "cenc",
      level
    ).then((supported) => {
      securityLevels.push({
        name: level,
        supported,
      });
    });
    promises.push(promise);
  });
  await Promise.allSettled(promises);

  const supportedEncryptions = await Promise.all(
    EncryptionSchemes.map(async (encryption) => ({
      name: encryption,
      supported: await isKeySystemSupported(keySystem, contentType, encryption),
    }))
  );

  return {
    type: KeySystemDrmTypeMap[keySystem],
    keySystem: keySystem,
    supportedEncryptions,
    securityLevels,
  };
}

async function getFairplay(contentType: string): Promise<IDrm> {
  const supportedEncryptions = await Promise.all(
    EncryptionSchemes.map(async (encryption) => ({
      name: encryption,
      supported: await isKeySystemSupported(
        KeySystem.FAIRPLAY,
        contentType,
        encryption
      ),
    }))
  );

  return {
    type: DrmType.WIDEVINE,
    keySystem: KeySystem.FAIRPLAY,
    supportedEncryptions,
    securityLevels: [],
  };
}

export function getDrm(type: DrmType, contentType: string): Promise<IDrm> {
  switch (type) {
    case DrmType.WIDEVINE:
      return getWidevine(contentType);
    case DrmType.PLAYREADY:
      return getPlayready(contentType, KeySystem.PLAYREADY);
    case DrmType.PLAYREADY_LEGACY:
      return getPlayready(contentType, KeySystem.PLAYREADY_LEGACY);
    case DrmType.FAIRPLAY:
      return getFairplay(contentType);
  }
}
