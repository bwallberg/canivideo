import { styled } from "solid-styled-components";
import SupportCard from "./SupportCard";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
`;

const Apis = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 0.1rem;
  margin-top: 0.1rem;

  > * {
    width: 100%;
    font-size: 0.75em;
  }
`;

const video = document.createElement("video");
function isCodecSupported(codec: string): { mse: boolean; video: boolean } {
  return {
    mse: window.MediaSource?.isTypeSupported(codec),
    video: !!video.canPlayType(codec),
  };
}

export default function Codec({
  title,
  codec,
}: {
  title: string;
  codec: string;
}) {
  const { mse, video } = isCodecSupported(codec);

  return (
    <Container>
      <SupportCard title={title} supported={mse || video} />
      <Apis>
        <SupportCard title={"MSE"} supported={mse} />
        <SupportCard title={"<video />"} supported={video} />
      </Apis>
    </Container>
  );
}
