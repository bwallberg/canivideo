import { useState, useEffect } from "preact/hooks";
import { canivideo, Container, Result } from "canivideo";
import { Supported, NotSupported, Unknown } from "../card/icons/icons";
import styles from "./support-table.module.css";
import { Fragment } from "preact/compat";

type SupportTableProps = {
  containers: {
    title: string;
    type: Container;
    codecs: {
      title: string;
      type: string;
    }[];
  }[];
};

type CodecsData = {
  [container: string]: {
    [codec: string]: {
      support?: Result["codecs"][string];
      isExpanded: boolean;
    };
  };
};

const keySystemLabels: Record<string, string> = {
  "com.widevine.alpha": "Widevine",
  "com.microsoft.playready": "PlayReady",
  "com.microsoft.playready.recommendation": "PlayReady Recommendation",
  "com.apple.fps": "FairPlay",
};

const encryptionLabels: Record<string, string> = {
  cenc: "CENC",
  cbcs: "CBCS",
  "cbcs-1-9": "CBCS 1-9",
};

export function SupportTable(props: SupportTableProps) {
  const [codecsData, setCodecsData] = useState<CodecsData>({});
  const [expandedContainers, setExpandedContainers] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const initialData: CodecsData = {};
    const initialExpanded: Record<string, boolean> = {};

    props.containers.forEach((container) => {
      initialData[container.type] = {};
      initialExpanded[container.type] = true;

      container.codecs.forEach((codec) => {
        initialData[container.type][codec.type] = {
          isExpanded: false,
        };
      });
    });

    setCodecsData(initialData);
    setExpandedContainers(initialExpanded);

    // Fetch support data for all containers
    props.containers.forEach((container) => {
      canivideo({
        container: container.type,
        codecs: container.codecs.map((codec) => codec.type),
        drm: [
          { keySystem: "com.widevine.alpha", encryption: "cenc" },
          { keySystem: "com.widevine.alpha", encryption: "cbcs" },
          { keySystem: "com.widevine.alpha", encryption: "cbcs-1-9" },
          { keySystem: "com.microsoft.playready", encryption: "cenc" },
          { keySystem: "com.microsoft.playready", encryption: "cbcs" },
          { keySystem: "com.microsoft.playready", encryption: "cbcs-1-9" },
          { keySystem: "com.apple.fps", encryption: "cbcs" },
        ],
        strict: false,
      }).then((result) => {
        setCodecsData((prev) => {
          const newData = { ...prev };
          container.codecs.forEach((codec) => {
            if (newData[container.type][codec.type]) {
              newData[container.type][codec.type].support =
                result.codecs[codec.type];
            }
          });
          return newData;
        });
      });
    });
  }, []);

  const toggleContainerExpand = (containerType: string) => {
    setExpandedContainers((prev) => ({
      ...prev,
      [containerType]: !prev[containerType],
    }));
  };

  const toggleCodecExpand = (containerType: string, codecType: string) => {
    setCodecsData((prev) => {
      const newData = { ...prev };
      if (newData[containerType]?.[codecType]) {
        newData[containerType][codecType] = {
          ...newData[containerType][codecType],
          isExpanded: !newData[containerType][codecType].isExpanded,
        };
      }
      return newData;
    });
  };

  function isCodecSupported(api?: any): boolean | undefined {
    return api?.mse || api?.htmlVideoElement;
  }

  const renderSupportIcon = (supported?: boolean, unknown?: boolean) => {
    if (unknown) return <Unknown />;
    if (supported === true) return <Supported />;
    if (supported === false) return <NotSupported />;
    return <Unknown />;
  };

  const renderWebCodecsCheckboxes = (support?: Result["codecs"][string]) => {
    if (!support?.api.webCodecs) return "-";

    const hasEncoder = support.api.webCodecs.encoder?.software;
    const hasDecoder = support.api.webCodecs.decoder?.software;

    return (
      <div className={styles.webCodecsCheckboxes}>
        <div className={styles.webCodecsCheckboxGroup}>
          <label className={styles.webCodecsCheckboxLabel}>
            <input
              type="checkbox"
              checked={!!hasDecoder}
              readOnly
              className={styles.webCodecsCheckbox}
            />
            <span className={styles.webCodecsCheckboxCustom}></span>
            <span className={styles.webCodecsLabel}>Decoder</span>
          </label>
        </div>
        <div className={styles.webCodecsCheckboxGroup}>
          <label className={styles.webCodecsCheckboxLabel}>
            <input
              type="checkbox"
              checked={!!hasEncoder}
              readOnly
              className={styles.webCodecsCheckbox}
            />
            <span className={styles.webCodecsCheckboxCustom}></span>
            <span className={styles.webCodecsLabel}>Encoder</span>
          </label>
        </div>
      </div>
    );
  };

  const renderWebCodecsDetails = (
    containerType: string,
    codecType: string,
    support?: Result["codecs"][string],
  ) => {
    if (!support?.api.webCodecs) return null;

    const encoder = support.api.webCodecs.encoder;
    const decoder = support.api.webCodecs.decoder;

    return (
      <Fragment key={`webcodecs-${containerType}-${codecType}`}>
        {decoder && (
          <tr className={styles.webCodecsDetailRow}>
            <td className={styles.containerCell}></td>
            <td className={styles.codecCell}></td>
            <td className={styles.htmlSupportCell}></td>
            <td className={styles.mseSupportCell}></td>
            <td className={styles.webCodecsSupportCell}>
              <div className={styles.webCodecsDetailContent}>
                <div>
                  <span className={styles.webCodecsDetailTitle}>
                    Decoder Software
                  </span>
                  {renderSupportIcon(decoder.software)}
                </div>
                <div>
                  <span className={styles.webCodecsDetailTitle}>
                    Decoder Hardware
                  </span>
                  {renderSupportIcon(decoder.hardware)}
                </div>
              </div>
            </td>
            <td className={styles.drmCell}></td>
          </tr>
        )}
        {encoder && (
          <tr className={styles.webCodecsDetailRow}>
            <td className={styles.containerCell}></td>
            <td className={styles.codecCell}></td>
            <td className={styles.htmlSupportCell}></td>
            <td className={styles.mseSupportCell}></td>
            <td className={styles.webCodecsSupportCell}>
              <div className={styles.webCodecsDetailContent}>
                <div>
                  <span className={styles.webCodecsDetailTitle}>
                    Encoder Software
                  </span>
                  {renderSupportIcon(encoder.software)}
                </div>
                <div>
                  <span className={styles.webCodecsDetailTitle}>
                    Encoder Hardware
                  </span>
                  {renderSupportIcon(encoder.hardware)}
                </div>
              </div>
            </td>
            <td className={styles.drmCell}></td>
          </tr>
        )}
      </Fragment>
    );
  };

  const renderDrmCheckboxes = (support?: Result["codecs"][string]) => {
    if (!support?.drm || support.drm.length === 0) return "-";

    // Group DRM by key system
    const drmBySystem: Record<string, any[]> = {};
    support.drm.forEach((drm) => {
      if (!drmBySystem[drm.keySystem]) {
        drmBySystem[drm.keySystem] = [];
      }
      drmBySystem[drm.keySystem].push(drm);
    });

    return (
      <div className={styles.drmCheckboxes}>
        {Object.entries(drmBySystem).map(([keySystem, drms]) => {
          const systemSupported = drms.some((drm) => drm.supported);
          const systemLabel = keySystemLabels[keySystem] || keySystem;

          return (
            <div key={keySystem} className={styles.drmCheckboxGroup}>
              <label className={styles.drmCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={systemSupported}
                  readOnly
                  className={styles.drmCheckbox}
                />
                <span className={styles.drmCheckboxCustom}></span>
                <span className={styles.drmSystemName}>{systemLabel}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDrmRows = (
    containerType: string,
    codecType: string,
    support?: Result["codecs"][string],
  ) => {
    if (!support?.drm || support.drm.length === 0) return null;

    // Group DRM by key system
    const drmBySystem: Record<string, any[]> = {};
    support.drm.forEach((drm) => {
      if (!drmBySystem[drm.keySystem]) {
        drmBySystem[drm.keySystem] = [];
      }
      drmBySystem[drm.keySystem].push(drm);
    });

    return Object.entries(drmBySystem).map(([keySystem, drms]) => {
      const systemSupported = drms.some((drm) => drm.supported);

      return (
        <Fragment key={`drm-system-${containerType}-${codecType}-${keySystem}`}>
          <tr className={styles.drmSystemRow}>
            <td className={styles.containerCell}></td>
            <td className={styles.codecCell}></td>
            <td className={styles.htmlSupportCell}></td>
            <td className={styles.mseSupportCell}></td>
            <td className={styles.webCodecsSupportCell}></td>
            <td className={styles.drmCell}>
              <div className={styles.drmSystemContent}>
                <span className={styles.drmSystemTitle}>
                  {keySystemLabels[keySystem] || keySystem}
                </span>
                {renderSupportIcon(systemSupported)}
              </div>
            </td>
          </tr>

          {drms.map((drm, index) => (
            <tr
              key={`drm-${containerType}-${codecType}-${keySystem}-${index}`}
              className={styles.drmRow}
            >
              <td className={styles.containerCell}></td>
              <td className={styles.codecCell}></td>
              <td className={styles.htmlSupportCell}></td>
              <td className={styles.mseSupportCell}></td>
              <td className={styles.webCodecsSupportCell}></td>
              <td className={styles.drmCell}>
                <div className={styles.drmContent}>
                  <span className={styles.drmEncryption}>
                    {encryptionLabels[drm.encryption] || drm.encryption}
                  </span>
                  {renderSupportIcon(drm.supported)}
                </div>
              </td>
            </tr>
          ))}
        </Fragment>
      );
    });
  };

  return (
    <div className={styles.supportTableContainer}>
      <table className={styles.supportTable}>
        <thead>
          <tr>
            <th className={styles.containerHeader}>Container</th>
            <th className={styles.codecHeader}>Codec</th>
            <th className={styles.htmlSupportHeader}>HTML</th>
            <th className={styles.mseSupportHeader}>MSE</th>
            <th className={styles.webCodecsSupportHeader}>WebCodecs</th>
            <th className={styles.drmHeader}>DRM Systems</th>
          </tr>
        </thead>
        <tbody>
          {props.containers.map((container) => (
            <Fragment key={`container-${container.type}`}>
              <tr
                className={styles.containerRow}
                onClick={() => toggleContainerExpand(container.type)}
              >
                <td colSpan={6} className={styles.containerCell}>
                  <div className={styles.containerContent}>
                    <span className={styles.containerTitle}>
                      {container.title}
                    </span>
                    <span className={styles.expandIcon}>
                      {expandedContainers[container.type] ? "▼" : "►"}
                    </span>
                  </div>
                </td>
              </tr>

              {expandedContainers[container.type] && (
                <>
                  {container.codecs.map((codec) => {
                    const codecData = codecsData[container.type]?.[codec.type];
                    const support = codecData?.support;
                    const isSupported = isCodecSupported(support?.api);
                    const hasDrm = support?.drm && support.drm.length > 0;
                    const hasWebCodecs =
                      support?.api.webCodecs?.encoder ||
                      support?.api.webCodecs?.decoder;

                    return (
                      <Fragment key={`codec-${container.type}-${codec.type}`}>
                        <tr
                          className={`${styles.codecRow} ${codecData?.isExpanded ? styles.expanded : ""}`}
                          onClick={() =>
                            (hasDrm || hasWebCodecs) &&
                            toggleCodecExpand(container.type, codec.type)
                          }
                        >
                          <td className={styles.containerCell}></td>
                          <td className={styles.codecCell}>
                            <div className={styles.codecContent}>
                              <span className={styles.codecTitle}>
                                {codec.title}
                              </span>
                              {(hasDrm || hasWebCodecs) && (
                                <span className={styles.expandIcon}>
                                  {codecData?.isExpanded ? "▼" : "►"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={styles.htmlSupportCell}>
                            {renderSupportIcon(support?.api?.htmlVideoElement)}
                          </td>
                          <td className={styles.mseSupportCell}>
                            {renderSupportIcon(support?.api?.mse)}
                          </td>
                          <td className={styles.webCodecsSupportCell}>
                            {renderWebCodecsCheckboxes(support)}
                          </td>
                          <td className={styles.drmCell}>
                            {renderDrmCheckboxes(support)}
                          </td>
                        </tr>

                        {codecData?.isExpanded && (
                          <>
                            {hasWebCodecs &&
                              renderWebCodecsDetails(
                                container.type,
                                codec.type,
                                support,
                              )}
                            {hasDrm &&
                              renderDrmRows(
                                container.type,
                                codec.type,
                                support,
                              )}
                          </>
                        )}
                      </Fragment>
                    );
                  })}
                </>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
