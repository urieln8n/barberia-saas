import { MockProvider } from "./providers/mock";
import { KlingProvider } from "./providers/kling";
import { RunwayProvider } from "./providers/runway";
import { LumaProvider } from "./providers/luma";
import { HiggsFieldProvider } from "./providers/higgsfield";

export type VideoGenerationInput = {
  templateType: string;
  style: string;
  inputData: Record<string, unknown>;
};

export type VideoJobStatus = {
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMsg?: string;
};

export interface VideoProvider {
  generateVideo(input: VideoGenerationInput): Promise<string>;
  getStatus(providerJobId: string, jobCreatedAt: Date): Promise<VideoJobStatus>;
}

export type VideoProviderName = "mock" | "kling" | "runway" | "luma" | "higgsfield";

export function getVideoProvider(provider: string): VideoProvider {
  switch (provider) {
    case "kling":      return new KlingProvider();
    case "runway":     return new RunwayProvider();
    case "luma":       return new LumaProvider();
    case "higgsfield": return new HiggsFieldProvider();
    default:           return new MockProvider();
  }
}
