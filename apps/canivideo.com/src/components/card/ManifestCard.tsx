import styles from "./card.module.css";
import { NotSupported, Supported, Unknown } from "./icons/icons";
import { KeySystem, Result, ResultApi, ResultDrm } from "canivideo";

type CardProps = {
  header: string;
  support: boolean | null;
};

export function ManifestCard({ header, support }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.supportHeader}>
        <span className={styles.label}>{header}</span>
        <span className={styles.support}>
          {support === undefined ? (
            <Unknown />
          ) : support ? (
            <Supported />
          ) : (
            <NotSupported />
          )}
        </span>
      </div>
    </div>
  );
}
