import styles from "./card.module.css";
import { useEffect, useRef } from "preact/hooks";
import { NotSupported, Supported, Unknown } from "./icons/icons";
import { Result, ResultApi, ResultDrm } from "canivideo";

type CardProps = {
  header: string;
  support?: Result["codecs"][string];
};

function isCodecSupported(api: ResultApi): boolean | undefined {
  return api.mse || api.htmlVideoElement;
}

function isDrmSupported(result?: ResultDrm[]) {
  return result?.some((drm) => drm.supported);
}

export function Card({ header, support }: CardProps) {
  const modalRef = useRef<HTMLDialogElement>();

  useEffect(() => {
    const handleClose = (event: Event) => {
      modalRef.current.close();
    };

    modalRef.current?.addEventListener("click", handleClose);
    modalRef.current?.addEventListener("keydown", handleClose);
    return () => {
      modalRef.current?.removeEventListener("keydown", handleClose);
      modalRef.current?.removeEventListener("click", handleClose);
    };
  }, []);

  return (
    <>
      <button
        className={styles.card}
        onClick={() => modalRef.current?.showModal()}
      >
        <div className={styles.supportTypes}>
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
        <div className={styles.supportTypes}>
          <span className={styles.label}>DRM</span>
          <span className={styles.support}>
            {support === undefined ? (
              <Unknown />
            ) : isDrmSupported(support.drm) ? (
              <Supported />
            ) : (
              <NotSupported />
            )}
          </span>
        </div>
      </button>
      <dialog className={styles.dialog} ref={modalRef}>
        <h2>{header}</h2>
        <table className={styles.supportTable}>
          <thead>
            <tr>
              <th>API</th>
              <th>Supported</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MSE</td>
              <td>{support?.api.mse ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>HTMLVideoElement</td>
              <td>{support?.api.htmlVideoElement ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
        <table className={styles.supportTable}>
          <thead>
            <tr>
              <th>Key System</th>
              <th>Supported</th>
              <th>Security Levels</th>
            </tr>
          </thead>
          <tbody>
            {support?.drm.map((drm) => (
              <tr>
                <td>{drm.keySystem}</td>
                <td>{drm.supported ? "Yes" : "No"}</td>
                <td>
                  {drm.securityLevels
                    .map(
                      (level) =>
                        `${level.name} ${level.supported ? "✅" : "🚫"}`,
                    )
                    .join(" - ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </dialog>
    </>
  );
}
