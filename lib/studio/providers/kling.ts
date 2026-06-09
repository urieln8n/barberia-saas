import type { VideoProvider, VideoGenerationInput, VideoJobStatus } from "../video-provider";

export class KlingProvider implements VideoProvider {
  async generateVideo(_input: VideoGenerationInput): Promise<string> {
    throw new Error("KlingProvider: not implemented — set KLING_API_KEY in env");
  }

  async getStatus(_providerJobId: string, _jobCreatedAt: Date): Promise<VideoJobStatus> {
    throw new Error("KlingProvider: not implemented");
  }
}
