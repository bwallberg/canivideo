import styles from "./card.module.css";
import { NotSupported, Supported, Unknown } from "./icons/icons";
import { KeySystem, Result, ResultApi, ResultDrm } from "canivideo";

type CardProps = {
  header: string;
  support?: Result["codecs"][string];
};

const keySystemLabels: Record<KeySystem, string> = {
  "com.widevine.alpha": "Widevine",
  "com.microsoft.playready": "PlayReady",
  "com.apple.fps": "FairPlay",
};

function isCodecSupported(api: ResultApi): boolean | undefined {
  return api.mse || api.htmlVideoElement;
}

export function Card({ header, support }: CardProps) {
  // Merge DRMs with the same key system
  //
  const drmMap = new Map<string, Map<string, boolean>>();

  support?.drm.forEach((drm) => {
    if (!drmMap.has(drm.keySystem)) {
      drmMap.set(drm.keySystem, new Map());
    }
    drmMap.get(drm.keySystem)!.set(drm.encryption, drm.supported);
  });

  return (
    <div className={styles.card}>
      <div className={styles.supportCodec}>
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
        Array.from(drmMap.entries()).map(([keySystem, encryptions]) => (
          <div className={`${styles.drmRow} ${styles.supported}`}>
            <div className={`${styles.supportKeySystem}`}>
              <span className={styles.label}>{keySystemLabels[keySystem]}</span>
            </div>
            <div className={styles.supportEncryptions}>
              {Array.from(encryptions.entries()).map(([enc, supported]) => (
                <div className={styles.supportEncryption}>
                  <span className={styles.label}>{enc}</span>
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
