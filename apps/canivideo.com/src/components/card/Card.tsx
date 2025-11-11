import { useEffect } from "preact/hooks";
import styles from "./card.module.css";
import { NotSupported, Supported, Unknown } from "./icons/icons";
import { KeySystem, Result, ResultApi, ResultDrm } from "canivideo";
import { useSignal } from "@preact/signals";

type CardProps = {
  header: string;
  support?: Result["codecs"][string];
};

const keySystemLabels: Record<KeySystem, string> = {
  "com.widevine.alpha": "Widevine",
  "com.microsoft.playready": "PlayReady",
  "com.microsoft.playready.recommendation": "PlayReady Recommendation",
  "com.apple.fps": "FairPlay",
};

function isCodecSupported(api: ResultApi): boolean | undefined {
  return api.mse || api.htmlVideoElement;
}

type KeySystemSupport = {
  keySystem: KeySystem;
  supported: boolean;
  encryptions: {
    encryption: string;
    supported: boolean;
  }[];
};

export function Card({ header, support }: CardProps) {
  const keySystems = useSignal<Map<KeySystem, KeySystemSupport>>(new Map())

  useEffect(() => {
    const result = new Map<KeySystem, KeySystemSupport>();
    for (const drm of support?.drm || []) {
      if (!result.has(drm.keySystem)) {
        result.set(drm.keySystem, {
          keySystem: drm.keySystem,
          supported: drm.supported,
          encryptions: []
        });
      }

      const keySystem = result.get(drm.keySystem);
      if (!keySystem) {
        continue;
      }

      keySystem.supported = keySystem.supported ? keySystem.supported : drm.supported
      keySystem.encryptions.push({
        encryption: drm.encryption,
        supported: drm.supported
      });
    }
    keySystems.value = result;
  }, [support]);

  return (
    <div className={styles.card}>
      <div className={styles.supportHeader}>
        <span className={styles.label}>{header}</span>
        <span className={styles.support}>
          {support === undefined ? (
            <Unknown />
          ) : isCodecSupported(support.api) ? (
            <Supported />
          ) : (
            <NotSupported />
          )}
        </span>
      </div>
      {
        Array.from(keySystems.value.entries()).map(([_, ks]) => (
          <div className={`${styles.drmRow} ${ ks.supported ? styles.supported : styles.notSupported}`}>
            <div className={`${styles.supportKeySystem}`}>
              <span className={styles.label}>{keySystemLabels[ks.keySystem]}</span>
            </div>
            <div className={styles.supportEncryptions}>
              {ks.encryptions.map(({ encryption, supported }) => (
                <div className={styles.supportEncryption}>
                  <span className={styles.label}>{encryption}</span>
                  <span className={styles.support}>
                    {supported ? <Supported /> : <NotSupported />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
}
