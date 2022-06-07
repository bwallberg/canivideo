import SupportCard from "./SupportCard";

const video = document.createElement("video");
function isCodecSupported(codec: string) {
  if (window.MediaSource) {
    return window.MediaSource.isTypeSupported(codec);
  } else {
    return !!video.canPlayType(codec);
  }
}

export default function Codec({
  title,
  codec,
}: {
  title: string;
  codec: string;
}) {
  const supported = isCodecSupported(codec);
  return <SupportCard title={title} supported={supported} />;
}
