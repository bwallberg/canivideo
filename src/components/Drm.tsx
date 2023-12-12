import { createSignal, For } from "solid-js";
import { styled } from "solid-styled-components";
import { DrmType, getDrm, IDrm, NameMap } from "../utils/drm";

import SupportCard from "./SupportCard";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
`;

const Options = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 0.1rem;
  margin-top: 0.1rem;

  > * {
    width: 100%;
    font-size: 0.75em;
  }
`;

export default function Drm({
  type,
  contentType,
}: {
  type: DrmType;
  contentType: string;
}) {
  const [drm, setDrm] = createSignal<IDrm | null>(null);

  getDrm(type, contentType).then((drm) => setDrm(drm));

  const supported = () => {
    const _drm = drm();
    return _drm
      ? _drm.supportedEncryptions.some((encryption) => encryption.supported)
      : null;
  };

  return (
    <Container>
      <SupportCard title={NameMap[type]} supported={supported()} />
      <Options>
        <For each={drm()?.supportedEncryptions}>
          {(encryption) => (
            <SupportCard
              title={encryption.name}
              supported={encryption.supported}
            />
          )}
        </For>
      </Options>
      {supported() && (
        <Options>
          <For each={drm()?.securityLevels}>
            {(securityLevel) => (
              <SupportCard
                title={securityLevel.name}
                supported={securityLevel.supported}
              />
            )}
          </For>
        </Options>
      )}
    </Container>
  );
}
