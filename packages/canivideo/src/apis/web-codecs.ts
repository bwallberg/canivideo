import { Container } from "../types";

type WebCodecsSupport = {
  encoder: {
    hardware?: boolean;
    software: boolean;
  };
  decoder: {
    hardware?: boolean;
    software: boolean;
  };
};

/**
 * Checks video codec support using WebCodecs API
 * Returns encoder and decoder support information
 */
async function getVideoCodecSupport(codec: string): Promise<WebCodecsSupport> {
  const result: WebCodecsSupport = {
    encoder: { hardware: undefined, software: false },
    decoder: { hardware: undefined, software: false },
  };

  // Check if the VideoEncoder is supported
  if (typeof VideoEncoder === "function") {
    try {
      const encoderConfig: VideoEncoderConfig = {
        codec,
        width: 640, // Example width
        height: 480, // Example height
      };

      const encoderSupport =
        await VideoEncoder.isConfigSupported(encoderConfig);
      if (encoderSupport.supported) {
        result.encoder.software = true;
        result.encoder.hardware =
          encoderSupport.config?.hardwareAcceleration === "prefer-hardware";
      }
    } catch (error) {
      console.error("Error checking video encoder support:", error);
    }
  }

  // Check if the VideoDecoder is supported
  if (typeof VideoDecoder === "function") {
    try {
      const decoderConfig: VideoDecoderConfig = {
        codec,
        codedWidth: 640, // Example width
        codedHeight: 480, // Example height
      };

      const decoderSupport =
        await VideoDecoder.isConfigSupported(decoderConfig);
      if (decoderSupport.supported) {
        result.decoder.software = true;
        result.decoder.hardware =
          decoderSupport.config?.hardwareAcceleration === "prefer-hardware";
      }
    } catch (error) {
      console.error("Error checking video decoder support:", error);
    }
  }

  return result;
}

/**
 * Checks audio codec support using WebCodecs API
 * Returns encoder and decoder support information
 */
async function getAudioCodecSupport(codec: string): Promise<WebCodecsSupport> {
  const result: WebCodecsSupport = {
    encoder: { hardware: undefined, software: false },
    decoder: { hardware: undefined, software: false },
  };

  // Check if the AudioEncoder is supported
  if (typeof AudioEncoder === "function") {
    try {
      const encoderConfig: AudioEncoderConfig = {
        codec,
        sampleRate: 44100, // Example sample rate
        numberOfChannels: 2, // Example number of channels
      };

      const encoderSupport =
        await AudioEncoder.isConfigSupported(encoderConfig);
      if (encoderSupport.supported) {
        result.encoder.software = true;
      }
    } catch (error) {
      console.error("Error checking audio encoder support:", error);
    }
  }

  // Check if the AudioDecoder is supported
  if (typeof AudioDecoder === "function") {
    try {
      const decoderConfig: AudioDecoderConfig = {
        codec,
        sampleRate: 44100, // Example sample rate
        numberOfChannels: 2, // Example number of channels
      };

      const decoderSupport =
        await AudioDecoder.isConfigSupported(decoderConfig);
      if (decoderSupport.supported) {
        result.decoder.software = true;
      }
    } catch (error) {
      console.error("Error checking audio decoder support:", error);
    }
  }

  return result;
}

export async function isCodecSupportedWebCodecs(
  container: Container,
  codec: string,
): Promise<WebCodecsSupport> {
  // Determine if the container is for video or audio
  const isVideoContainer = container.startsWith("video/");
  const isAudioContainer = container.startsWith("audio/");

  // Check for video support
  if (isVideoContainer) {
    return getVideoCodecSupport(codec);
  }
  // Check for audio support
  else if (isAudioContainer) {
    return getAudioCodecSupport(codec);
  }

  // Return default result if container type is not recognized
  return {
    encoder: { hardware: undefined, software: false },
    decoder: { hardware: undefined, software: false },
  };
}
