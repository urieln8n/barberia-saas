import type { VideoProvider, VideoGenerationInput, VideoJobStatus } from "../video-provider";

export class LumaProvider implements VideoProvider {
  async generateVideo(_input: VideoGenerationInput): Promise<string> {
    throw new Error("LumaProvider: not implemented — set LUMA_API_KEY in env");
  }

  async getStatus(_providerJobId: string, _jobCreatedAt: Date): Promise<VideoJobStatus> {
    throw new Error("LumaProvider: not implemented");
  }
}
