export enum DrmType {
  WIDEVINE,
  PLAYREADY,
  FAIRPLAY,
}

export enum KeySystem {
  WIDEVINE = "com.widevine.alpha",
  PLAYREADY = "com.microsoft.playready",
  FAIRPLAY = "com.apple.fps",
}

export const NameMap = {
  [DrmType.WIDEVINE]: "Google Widevine",
  [DrmType.PLAYREADY]: "Microsoft PlayReady",
  [DrmType.FAIRPLAY]: "Apple FairPlay",
};

export type SecurityLevel = {
  name: string;
  supported: boolean;
};

export interface IDrm {
  type: DrmType;
  keySystem: KeySystem;
  supported: boolean;
  securityLevels: SecurityLevel[];
}

function isKeySystemSupported(keySystem: KeySystem, robustness: string = "") {
  if (navigator.requestMediaKeySystemAccess) {
    return navigator
      .requestMediaKeySystemAccess(keySystem, [
        {
          initDataTypes: ["cenc"],
          videoCapabilities: [
            {
              contentType: 'video/mp4; codecs="avc1.42E01E"',
              robustness,
            },
          ],
        },
      ])
      .then((access) => access.createMediaKeys())
      .then(() => true)
      .catch(() => false);
  } else {
    return Promise.reject();
  }
}

async function getWidevine(): Promise<IDrm> {
  const supportedRobustness = (
    await Promise.all(
      [
        "HW_SECURE_ALL",
        "HW_SECURE_DECODE",
        "HW_SECURE_CRYPTO",
        "SW_SECURE_DECODE",
        "SW_SECURE_CRYPTO",
      ].map((robustness) =>
        isKeySystemSupported(KeySystem.WIDEVINE, robustness).then((supported) =>
          supported ? robustness : null
        )
      )
    )
  ).filter((robustness) => !!robustness);

  return {
    type: DrmType.WIDEVINE,
    keySystem: KeySystem.WIDEVINE,
    supported: await isKeySystemSupported(KeySystem.WIDEVINE),
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

async function getPlayready(): Promise<IDrm> {
  const securityLevels: SecurityLevel[] = [];
  const promises: Promise<any>[] = [];
  ["3000", "2000", "150"].forEach((level) => {
    const promise = isKeySystemSupported(KeySystem.PLAYREADY, level).then(
      (supported) => {
        securityLevels.push({
          name: level,
          supported,
        });
        promises.push(promise);
      }
    );
  });
  await Promise.allSettled(promises);
  return {
    type: DrmType.PLAYREADY,
    keySystem: KeySystem.PLAYREADY,
    supported: await isKeySystemSupported(KeySystem.WIDEVINE),
    securityLevels,
  };
}

async function getFairplay(): Promise<IDrm> {
  return {
    type: DrmType.WIDEVINE,
    keySystem: KeySystem.WIDEVINE,
    supported: await isKeySystemSupported(KeySystem.FAIRPLAY),
    securityLevels: [],
  };
}

export function getDrm(type: DrmType): Promise<IDrm> {
  switch (type) {
    case DrmType.WIDEVINE:
      return getWidevine();
    case DrmType.PLAYREADY:
      return getPlayready();
    case DrmType.FAIRPLAY:
      return getFairplay();
  }
}
