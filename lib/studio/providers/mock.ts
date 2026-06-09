import type { VideoProvider, VideoGenerationInput, VideoJobStatus } from "../video-provider";

export class MockProvider implements VideoProvider {
  async generateVideo(_input: VideoGenerationInput): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  async getStatus(providerJobId: string, jobCreatedAt: Date): Promise<VideoJobStatus> {
    const ageMs = Date.now() - jobCreatedAt.getTime();
    if (ageMs < 5000) {
      return { status: "processing" };
    }
    return {
      status: "completed",
      videoUrl: `https://storage.barberia-os.dev/mock-videos/${providerJobId}.mp4`,
      thumbnailUrl: `https://storage.barberia-os.dev/mock-thumbnails/${providerJobId}.jpg`,
    };
  }
}
