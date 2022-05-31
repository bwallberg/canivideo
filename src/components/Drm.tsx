import { createSignal } from "solid-js";
import { styled } from "solid-styled-components";

import barsSvg from "../assets/bars.svg";

const Container = styled("div")<{ supported: boolean | null }>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding 0 0.5rem;

  background: var(${(props) => (props.supported ? "--nord14" : "--nord11")});
`;

const Loading = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--nord13);
`;

const Title = styled("h3")``;

function isKeySystemSupported(keySystem: string) {
  if (navigator.requestMediaKeySystemAccess) {
    return navigator
      .requestMediaKeySystemAccess(keySystem, [
        {
          initDataTypes: ["cenc"],
          videoCapabilities: [
            {
              contentType: 'video/mp4; codecs="avc1.42E01E"',
            },
          ],
        },
      ])
      .then((access) => access.createMediaKeys());
  } else {
    return Promise.reject();
  }
}

export default function Drm({
  title,
  keySystem,
}: {
  title: string;
  keySystem: string;
}) {
  const [supported, setSupported] = createSignal<boolean | null>(null);

  isKeySystemSupported(keySystem).then(
    () => setSupported(true),
    () => setSupported(false)
  );

  if (supported === null) {
    return (
      <Loading>
        <img src={barsSvg} />
      </Loading>
    );
  }
  return (
    <Container supported={supported()}>
      <Title>{title}</Title>
    </Container>
  );
}
