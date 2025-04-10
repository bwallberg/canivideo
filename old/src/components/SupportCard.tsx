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

export const Title = styled("h3")`
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
`;

export default function SupportCard(props: {
  title: string;
  supported: boolean | null;
}) {
  return (
    <Container supported={props.supported}>
      {props.supported === null && <img src={barsSvg} />}
      <Title>{props.title}</Title>
    </Container>
  );
}
