import { Container } from "canivideo";
import styles from "./app.module.css";
import { SupportTable } from "./components/support-table";
import { ThemeSwitcher } from "./components/theme-switcher";

const VideoContainers: {
  title: string;
  type: Container;
  codecs: {
    title: string;
    type: string;
  }[];
}[] = [
  {
    title: "video - mp4",
    type: "video/mp4",
    codecs: [
      { title: "H.264", type: "avc1.42E01E" },
      { title: "H.265/HEVC | hvc1", type: "hvc1.1.6.L93.90" },
      { title: "H.265/HEVC | hev1", type: "hev1.1.6.L93.90" },
      { title: "VP8", type: "vp8" },
      { title: "VP9", type: "vp9" },
      { title: "AV1 | 8 bits", type: "av01.0.00M.08" },
      { title: "AV1 | 10 bits", type: "av01.0.00M.10" },
      { title: "AV1 | 12 bits", type: "av01.0.00M.12" },
      { title: "Dolby Vision | dvhe", type: "dvhe.05.07" },
      { title: "Dolby Vision | dvh1", type: "dvh1.05.07" },
    ],
  },
  {
    title: "video - webm",
    type: "video/webm",
    codecs: [
      { title: "H.264", type: "avc1.42E01E" },
      { title: "H.265/HEVC | hvc1", type: "hvc1.1.6.L93.90" },
      { title: "H.265/HEVC | hev1", type: "hev1.1.6.L93.90" },
      { title: "VP8", type: "vp8" },
      { title: "VP9", type: "vp9" },
      { title: "AV1 | 8 bits", type: "av01.0.00M.08" },
      { title: "AV1 | 10 bits", type: "av01.0.00M.10" },
      { title: "AV1 | 12 bits", type: "av01.0.00M.12" },
      { title: "Dolby Vision | dvhe", type: "dvhe.05.07" },
      { title: "Dolby Vision | dvh1", type: "dvh1.05.07" },
    ],
  },
  {
    title: "video - matroska",
    type: "video/matroska",
    codecs: [
      { title: "H.264", type: "avc1.42E01E" },
      { title: "H.265/HEVC | hvc1", type: "hvc1.1.6.L93.90" },
      { title: "H.265/HEVC | hev1", type: "hev1.1.6.L93.90" },
      { title: "VP8", type: "vp8" },
      { title: "VP9", type: "vp9" },
      { title: "AV1 | 8 bits", type: "av01.0.00M.08" },
      { title: "AV1 | 10 bits", type: "av01.0.00M.10" },
      { title: "AV1 | 12 bits", type: "av01.0.00M.12" },
      { title: "Dolby Vision | dvhe", type: "dvhe.05.07" },
      { title: "Dolby Vision | dvh1", type: "dvh1.05.07" },
    ],
  },
];

const AudioContainers: {
  title: string;
  type: Container;
  codecs: {
    title: string;
    type: string;
  }[];
}[] = [
  {
    title: "audio - mp4",
    type: "audio/mp4",
    codecs: [
      { title: "AAC", type: "mp4a.40.2" },
      { title: "AC-3", type: "ac-3" },
      { title: "EC-3", type: "ec-3" },
    ],
  },
];

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>CAN I VIDEO</h1>
      </header>
      <main className={styles.main}>
        <h2 style={{ textAlign: "center", margin: "1rem 0" }}>
          Video & Audio Codec Support
        </h2>
        <SupportTable containers={[...VideoContainers, ...AudioContainers]} />
      </main>
      <footer className={styles.footer}>
        made with ♥ by <a href="https://bwallberg.com">bwallberg</a>
      </footer>
      <ThemeSwitcher />
    </div>
  );
}
