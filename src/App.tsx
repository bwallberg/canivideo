import { styled } from "solid-styled-components";
import Codec from "./components/Codec";

const Wrapper = styled("div")``;

const Container = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media only screen and (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Header = styled("header")`
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--nord1);
`;

const GridWrapper = styled("section")`
  display: flex;
  flex-direction: column;
  background: var(--nord2);
  border-radius: 1rem;

  padding: 1rem;
  margin: 1rem;

  h2 {
    text-align: center;
  }
`;

const Grid = styled("div")`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const Footnote = styled("p")`
  font-style: italic;
`;

const Footer = styled("footer")`
  text-align: center;

  a {
    font-weight: bold;
    text-decoration: none;
  }
`;

function App() {
  return (
    <Wrapper>
      <Header>
        <h1>CAN I VIDEO?</h1>
      </Header>
      <Container>
        <GridWrapper>
          <h2>VIDEO CODECS - video/mp4</h2>
          <Grid>
            <Codec
              title="Advanced Video Coding, h.264"
              contentType='video/mp4; codecs="avc1.42E01E"'
            />
            <Codec
              title="High Efficiency Video Coding, h.265/HEVC | hvc1"
              contentType='video/mp4; codecs="hvc1.1.6.L93.90"'
            />
            <Codec
              title="High Efficiency Video Coding, h.265/HEVC | hev1"
              contentType='video/mp4; codecs="hev1.1.6.L93.90"'
            />
            <Codec
              title="AOMedia Video 1, AV1 | 8 bits"
              contentType='video/mp4; codecs="av01.0.00M.08"'
            />
            <Codec
              title="AOMedia Video 1, AV1 | 10 bits"
              contentType='video/mp4; codecs="av01.0.00M.10"'
            />
            <Codec
              title="AOMedia Video 1, AV1 | 12 bits"
              contentType='video/mp4; codecs="av01.0.00M.12"'
            />
            <Codec title="Dolby Vision, dvhe" contentType={'video/mp4; codecs="dvhe.05.07"'} />
            <Codec title="Dolby Vision, dvh1" contentType={'video/mp4; codecs="dvh1.05.07"'} />
          </Grid>
        </GridWrapper>
        <GridWrapper>
          <h2>AUDIO CODECS - audio/mp4</h2>
          <Grid>
            <Codec
              title="Advanced Audio Coding, AAC"
              contentType='audio/mp4; codecs="mp4a.40.2"'
              drm={false}
            />
            <Codec
              title="Dolby Digital, AC-3"
              contentType='audio/mp4; codecs="ac-3"'
              drm={false}
            />
            <Codec
              title="Dolby Digital Plus, EC-3"
              contentType='audio/mp4; codecs="ec-3"'
              drm={false}
            />
          </Grid>
        </GridWrapper>
      </Container>
      <Footer>
        <Footnote>
          Note! Only a single test is performed per codec, basic functionality
          should exist if green but different profiles/levels might not be
          supported.{" "}
        </Footnote>
        <small>
          by{" "}
          <a href="https://bwallberg.com" target="_blank">
            @bwallberg
          </a>
        </small>
      </Footer>
    </Wrapper>
  );
}

export default App;
