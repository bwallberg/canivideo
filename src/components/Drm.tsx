import { createSignal, For } from "solid-js";
import { styled } from "solid-styled-components";
import { DrmType, getDrm, IDrm, NameMap } from "../utils/drm";

import SupportCard from "./SupportCard";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
`;

const RobustnessContainer = styled("div")`
  display: flex;
  flex-direction: row;
  > * {
    width: 100%;
    font-size: 0.75em;
  }
`;

export default function Drm({ type }: { type: DrmType }) {
  const [drm, setDrm] = createSignal<IDrm | null>(null);

  getDrm(type).then((drm) => setDrm(drm))

  return (
    <Container>
      <SupportCard title={NameMap[type]} supported={drm()?.supported ?? null} />
      <RobustnessContainer>
        <For each={drm()?.securityLevels}>
          {(securityLevel) => (
            <SupportCard
              title={securityLevel.name}
              supported={securityLevel.supported}
            />
          )}
        </For>
      </RobustnessContainer>
    </Container>
  );
}
