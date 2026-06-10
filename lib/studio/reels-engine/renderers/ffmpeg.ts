import type { ReelRenderer, ReelAssemblyInput, ReelAssemblyOutput, ReelJobStatus } from "../types";

// Stub — FFmpeg runner for self-hosted environments (Railway, Render, Docker).
// Cannot run on Vercel serverless (no binary support).
// Implement when dedicated compute is provisioned.
// Approach: fluent-ffmpeg + Node child_process + job queue (Bull/BullMQ).
export class FFmpegRenderer implements ReelRenderer {
  async render(_input: ReelAssemblyInput): Promise<ReelAssemblyOutput> {
    throw new Error("FFmpegRenderer not yet implemented — requires dedicated compute (not Vercel)");
  }
  async getStatus(_rendererJobId: string): Promise<ReelJobStatus> {
    throw new Error("FFmpegRenderer not yet implemented");
  }
}
