import { styled } from "solid-styled-components";
import { DrmType } from "../utils/drm";
import Drm from "./Drm";
import SupportCard from "./SupportCard";

const Wrapper = styled("div")``;

const Container = styled("div")`
  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

const Children = styled("div")`
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
  contentType,
  drm = true,
}: {
  title: string;
  contentType: string;
  drm?: boolean;
}) {
  const { mse, video } = isCodecSupported(contentType);

  const supported: boolean = !!mse || !!video;

  return (
    <Wrapper>
      <Container>
        <SupportCard title={title} supported={supported} />
        {supported && (
          <Children>
            <SupportCard title={"MSE"} supported={mse} />
            <SupportCard title={"<video />"} supported={video} />
          </Children>
        )}
        {supported && drm && (
          <Children>
            <Drm type={DrmType.WIDEVINE} contentType={contentType} />
            <Drm type={DrmType.PLAYREADY} contentType={contentType} />
            <Drm type={DrmType.PLAYREADY_LEGACY} contentType={contentType} />
            <Drm type={DrmType.FAIRPLAY} contentType={contentType} />
          </Children>
        )}
      </Container>
    </Wrapper>
  );
}
