import styles from "./card.module.css";
import { useEffect, useRef } from "preact/hooks";
import { NotSupported, Supported, Unknown } from "./icons/icons";

type CardProps = {
  header: string;
  supported?: boolean;
};

export function Card({ header, supported }: CardProps) {
  const modalRef = useRef<HTMLDialogElement>();

  useEffect(() => {
    const handleClose = (event: Event) => {
      modalRef.current.close();
    };

    modalRef.current?.addEventListener("click", handleClose);
    return () => {
      modalRef.current?.removeEventListener("click", handleClose);
    };
  }, []);

  return (
    <>
      <div
        className={styles.card}
        onClick={() => modalRef.current?.showModal()}
      >
        <div className={styles.supportTypes}>
          <span className={styles.label}>{header}</span>
          <span className={styles.support}>
            {supported === undefined ? (
              <Unknown />
            ) : supported ? (
              <Supported />
            ) : (
              <NotSupported />
            )}
          </span>
        </div>
        <div className={styles.supportTypes}>
          <span className={styles.label}>DRM</span>
          <span className={styles.support}>
            {supported === undefined ? (
              <Unknown />
            ) : supported ? (
              <Supported />
            ) : (
              <NotSupported />
            )}
          </span>
        </div>
      </div>
      <dialog className={styles.dialog} ref={modalRef}>
        <h2>{header}</h2>
        <table>
          <thead>
            <tr>
              <th>Key System</th>
              <th>Supported</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Widevine</td>
              <td>{supported ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>PlayReady</td>
              <td>{supported ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </dialog>
    </>
  );
}
