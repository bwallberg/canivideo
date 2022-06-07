import { styled } from "solid-styled-components";
import Codec from "./components/Codec";
import Drm from "./components/Drm";
import { DrmType } from "./utils/drm";

const Wrapper = styled("div")``;

const Container = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media only screen and (max-width: 992px) {
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

  padding: 0.5rem;
  margin: 0.5rem;

  h2 {
    text-align: center;
  }
`;

const Grid = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
`;

const Footer = styled("footer")`
  text-align: center;
`;

function App() {
  return (
    <Wrapper>
      <Header>
        <h1>Can I video?</h1>
      </Header>
      <Container>
        <GridWrapper>
          <h2>Video codecs</h2>
          <Grid>
            <Codec
              title="Advanced Video Coding, h.264"
              codec='video/mp4; codecs="avc1.42E01E"'
            />
            <Codec
              title="High Efficiency Video Coding, h.265/HEVC"
              codec='video/mp4; codecs="hev1.1.6.L93.90"'
            />
          </Grid>
          <GridWrapper>
            <h2>Audio codecs</h2>
            <Grid>
              <Codec
                title="Advanced Audio Coding, AAC"
                codec='audio/mp4; codecs="mp4a.40.2"'
              />
              <Codec
                title="Dolby Digital, AC-3"
                codec='audio/mp4; codecs="ac-3"'
              />
              <Codec
                title="Dolby Digital Plus, EC-3"
                codec='audio/mp4; codecs="ec-3"'
              />
            </Grid>
          </GridWrapper>
        </GridWrapper>
        <GridWrapper>
          <h2>DRM</h2>
          <Grid>
            <Drm type={DrmType.WIDEVINE} />
            <Drm type={DrmType.PLAYREADY} />
            <Drm type={DrmType.FAIRPLAY} />
          </Grid>
        </GridWrapper>
      </Container>
      <Footer>
        <small>&copy; Copyright 2022, Benjamin Wallberg</small>
      </Footer>
    </Wrapper>
  );
}

export default App;
