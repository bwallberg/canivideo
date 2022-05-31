import { createEffect, createSignal } from "solid-js";
import { styled } from "solid-styled-components";

import barsSvg from "../assets/bars.svg";

const Container = styled("div")<{ supported: boolean | null }>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0 0.5rem;

  background: var(
    ${(props) =>
      props.supported === null
        ? "--nord3"
        : props.supported
        ? "--nord14"
        : "--nord11"}
  );

  img {
    margin-right: 0.5rem;
    height: 1.5rem;
  }
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

  return (
    <Container supported={supported()}>
      {supported() === null && <img src={barsSvg} />}
      <Title>{title}</Title>
    </Container>
  );
}
