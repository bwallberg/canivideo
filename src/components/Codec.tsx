import { styled } from "solid-styled-components";

const Container = styled("div")<{ supported: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding 0 0.5rem;

  background: var(${(props) => (props.supported ? "--nord14" : "--nord11")});
`;

const Title = styled("h3")``;

export default function Codec({
  title,
  codec,
}: {
  title: string;
  codec: string;
}) {
  const supported = MediaSource.isTypeSupported(codec);
  return (
    <Container supported={supported}>
      <Title>{title}</Title>
    </Container>
  );
}
