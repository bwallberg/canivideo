import { Container } from "canivideo";
import styles from "./app.module.css";
import { SupportGrid } from "./components/support-grid/SupportGrid";
import { ThemeSwitcher } from "./components/theme-switcher";
import { SupportGridManifest } from "./components/support-grid/SupportGridManifest";

const VideoContainers: {
  title: string;
  type: Container;
}[] = [
  {
    title: "video - mp4",
    type: "video/mp4",
  },
  {
    title: "video - webm",
    type: "video/webm",
  },
];

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>CAN I VIDEO</h1>
      </header>
      <main className={styles.main}>
        <SupportGridManifest
          header="manifests"
          manifests={["application/vnd.apple.mpegurl", "application/dash+xml"]}
        />
        {VideoContainers.map((container) => (
          <SupportGrid
            header={container.title}
            container={container.type}
            codecs={[
              { title: "H.264", type: "avc1.42E01E" },
              { title: "H.265/HEVC | hvc1", type: "hvc1.1.6.L93.90" },
              { title: "H.265/HEVC | hev1", type: "hev1.1.6.L93.90" },
              { title: "AV1 | 8 bits", type: "av01.0.00M.08" },
              { title: "AV1 | 10 bits", type: "av01.0.00M.10" },
              { title: "AV1 | 12 bits", type: "av01.0.00M.12" },
              { title: "Dolby Vision | dvhe", type: "dvhe.05.07" },
              { title: "Dolby Vision | dvh1", type: "dvh1.05.07" },
            ]}
          />
        ))}
        <SupportGrid
          header="audio - mp4"
          container="audio/mp4"
          codecs={[
            { title: "AAC", type: "mp4a.40.2" },
            { title: "AC-3", type: "ac-3" },
            { title: "EC-3", type: "ec-3" },
          ]}
        />
      </main>
      <footer className={styles.footer}>
        made with ♥ by <a href="https://bwallberg.com">bwallberg</a>
      </footer>
      <ThemeSwitcher />
    </div>
  );
}
