import type { VideoProvider, VideoGenerationInput, VideoJobStatus } from "../video-provider";

export class RunwayProvider implements VideoProvider {
  async generateVideo(_input: VideoGenerationInput): Promise<string> {
    throw new Error("RunwayProvider: not implemented — set RUNWAY_API_KEY in env");
  }

  async getStatus(_providerJobId: string, _jobCreatedAt: Date): Promise<VideoJobStatus> {
    throw new Error("RunwayProvider: not implemented");
  }
}
