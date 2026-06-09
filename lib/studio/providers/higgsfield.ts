import type { VideoProvider, VideoGenerationInput, VideoJobStatus } from "../video-provider";

export class HiggsFieldProvider implements VideoProvider {
  async generateVideo(_input: VideoGenerationInput): Promise<string> {
    throw new Error("HiggsFieldProvider: not implemented — set HIGGSFIELD_API_KEY in env");
  }

  async getStatus(_providerJobId: string, _jobCreatedAt: Date): Promise<VideoJobStatus> {
    throw new Error("HiggsFieldProvider: not implemented");
  }
}
