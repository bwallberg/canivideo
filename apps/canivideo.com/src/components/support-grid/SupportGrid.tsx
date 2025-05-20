import { canivideo, Container, Result, ResultDrm } from "canivideo";
import { Card } from "../card/Card";
import styles from "./support-grid.module.css";
import { useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";

type SupportGridProps = {
  header: string;
  container: Container;
  codecs: {
    title: string;
    type: string;
  }[];
};

export function SupportGrid(props: SupportGridProps) {
  const support = useSignal<Result | null>(null);
  useEffect(() => {
    let cancelled = false;
    canivideo({
      container: props.container,
      codecs: props.codecs.map((codec) => codec.type),
      drm: [
        { keySystem: "com.widevine.alpha", encryption: "cenc" },
        { keySystem: "com.apple.fps", encryption: "cbcs" },
        { keySystem: "com.microsoft.playready", encryption: "cenc" },
      ],
      strict: false,
    })
      .then((result) => {
        if (cancelled) return;
        support.value = result;
      })
      .then(() => {});

    return () => {
      cancelled = true;
    };
  }, [support]);

  return (
    <div>
      <h2 className={styles.supportHeader}>{props.header}</h2>
      <div className={styles.supportGrid}>
        {props.codecs.map((codec) => (
          <Card
            header={codec.title}
            support={support.value?.codecs[codec.type]}
          />
        ))}
      </div>
    </div>
  );
}
