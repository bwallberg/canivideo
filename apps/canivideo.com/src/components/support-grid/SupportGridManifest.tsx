import { canimanifest, Manifest } from "canivideo";
import styles from "./support-grid.module.css";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { ManifestCard } from "../card/ManifestCard";

type SupportGridProps = {
  header: string;
  manifests: Manifest[];
};

type SupportedManifest = {
  manifest: Manifest;
  support: boolean | null;
};

export function SupportGridManifest(props: SupportGridProps) {
  const support = useSignal<SupportedManifest[]>(
    props.manifests.map((manifest) => ({
      manifest,
      support: null,
    }))
  );

  useEffect(() => {
    let cancelled = false;

    Promise.all(props.manifests.map((manifest) => canimanifest(manifest))).then(
      (settled) => {
        if (cancelled) return;
        const results: SupportedManifest[] = settled.map(
          (supported, index) => ({
            manifest: props.manifests[index],
            support: supported,
          })
        );
        support.value = results;
      }
    );

    return () => {
      cancelled = true;
    };
  }, [support]);

  return (
    <div>
      <h2 className={styles.supportHeader}>{props.header}</h2>
      <div className={styles.supportGrid}>
        {support.value.map((manifest) => (
          <ManifestCard
            header={manifest.manifest}
            support={manifest.support}
          />
        ))}
      </div>
    </div>
  );
}
