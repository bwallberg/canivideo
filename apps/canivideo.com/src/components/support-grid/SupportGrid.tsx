import { canivideo, Container, Result } from "canivideo";
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

function isCodecSupported(
  result: Result | null,
  codec: string,
): boolean | undefined {
  return result?.codecs[codec]?.mse || result?.codecs[codec]?.htmlVideoElement;
}

export function SupportGrid(props: SupportGridProps) {
  const support = useSignal<Result | null>(null);
  useEffect(() => {
    let cancelled = false;
    canivideo({
      container: props.container,
      codecs: props.codecs.map((codec) => codec.type),
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
            supported={isCodecSupported(support.value, codec.type)}
          />
        ))}
        {/* <Card supported={true}></Card> */}
      </div>
    </div>
  );
}
