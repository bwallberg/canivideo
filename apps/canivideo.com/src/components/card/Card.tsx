import { useMemo } from "preact/hooks";
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
  "com.microsoft.playready.recommendation": "PlayReady Recommendation",
  "com.apple.fps": "FairPlay",
};

function securityLevelLabel(keySystem: KeySystem, level: string): string {
  switch (keySystem) {
    case "com.microsoft.playready":
    case "com.microsoft.playready.recommendation":
      return `SL${level}`;
    default:
      return level;
  }
}

function isCodecSupported(api: ResultApi): boolean | undefined {
  return api.mse || api.htmlVideoElement;
}

type DrmRow = {
  keySystem: KeySystem;
  securityLevels: string[];
  supported: boolean;
  encryptions: {
    encryption: string;
    supported: boolean;
  }[];
};

/**
 * Groups DRM results into rows per key system. Security levels that share the
 * exact same support across all encryption schemes are merged into a single
 * row (e.g. "L1, L2" unsupported and "L3" supported). Key systems without
 * security levels (e.g. FairPlay) get a single row.
 */
function groupDrmRows(drm: ResultDrm[]): DrmRow[] {
  // First pass: one row per key system + security level.
  const perLevel = new Map<string, DrmRow>();

  const addEntry = (
    keySystem: KeySystem,
    securityLevel: string | undefined,
    encryption: string,
    supported: boolean,
  ) => {
    const key = securityLevel ? `${keySystem}:${securityLevel}` : keySystem;
    let row = perLevel.get(key);
    if (!row) {
      row = {
        keySystem,
        securityLevels: securityLevel ? [securityLevel] : [],
        supported: false,
        encryptions: [],
      };
      perLevel.set(key, row);
    }
    row.supported = row.supported || supported;
    row.encryptions.push({ encryption, supported });
  };

  for (const result of drm) {
    if (result.securityLevels.length === 0) {
      addEntry(result.keySystem, undefined, result.encryption, result.supported);
      continue;
    }
    for (const level of result.securityLevels) {
      addEntry(result.keySystem, level.name, result.encryption, level.supported);
    }
  }

  // Second pass: merge levels of the same key system with identical support.
  const merged = new Map<string, DrmRow>();
  for (const row of perLevel.values()) {
    const signature = row.encryptions
      .map(({ encryption, supported }) => `${encryption}=${supported}`)
      .join(",");
    const key = `${row.keySystem}|${signature}`;
    const existing = merged.get(key);
    if (existing) {
      existing.securityLevels.push(...row.securityLevels);
    } else {
      merged.set(key, row);
    }
  }

  return Array.from(merged.values());
}

export function Card({ header, support }: CardProps) {
  const rows = useMemo(() => groupDrmRows(support?.drm ?? []), [support]);

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
      {rows.map((row) => (
        <div
          key={`${row.keySystem}:${row.securityLevels.join(",")}`}
          className={`${styles.drmRow} ${row.supported ? styles.supported : styles.notSupported}`}
        >
          <div className={styles.supportKeySystem}>
            <span className={styles.label}>{keySystemLabels[row.keySystem]}</span>
            {row.securityLevels.length > 0 && (
              <span className={styles.securityLevel}>
                {row.securityLevels
                  .map((level) => securityLevelLabel(row.keySystem, level))
                  .join(", ")}
              </span>
            )}
          </div>
          <div className={styles.supportEncryptions}>
            {row.encryptions.map(({ encryption, supported }) => (
              <div key={encryption} className={styles.supportEncryption}>
                <span className={styles.label}>{encryption}</span>
                <span className={styles.support}>
                  {supported ? <Supported /> : <NotSupported />}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
