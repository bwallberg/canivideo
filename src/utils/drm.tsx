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

function isKeySystemSupported(
  keySystem: KeySystem,
  contentType: string,
  robustness: string = "",
) {
  if (navigator.requestMediaKeySystemAccess) {
    return navigator
      .requestMediaKeySystemAccess(keySystem, [
        {
          initDataTypes: ["cenc"],
          videoCapabilities: [
            {
              contentType,
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
        isKeySystemSupported(KeySystem.WIDEVINE, contentType, robustness).then(
          (supported) => (supported ? robustness : null)
        )
      )
    )
  ).filter((robustness) => !!robustness);

  return {
    type: DrmType.WIDEVINE,
    keySystem: KeySystem.WIDEVINE,
    supported: await isKeySystemSupported(KeySystem.WIDEVINE, contentType),
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

async function getPlayready(contentType: string): Promise<IDrm> {
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
    supported: await isKeySystemSupported(KeySystem.PLAYREADY, contentType),
    securityLevels,
  };
}

async function getFairplay(contentType: string): Promise<IDrm> {
  return {
    type: DrmType.WIDEVINE,
    keySystem: KeySystem.WIDEVINE,
    supported: await isKeySystemSupported(KeySystem.FAIRPLAY, contentType),
    securityLevels: [],
  };
}

export function getDrm(type: DrmType, contentType: string): Promise<IDrm> {
  switch (type) {
    case DrmType.WIDEVINE:
      return getWidevine(contentType);
    case DrmType.PLAYREADY:
      return getPlayready(contentType);
    case DrmType.FAIRPLAY:
      return getFairplay(contentType);
  }
}
