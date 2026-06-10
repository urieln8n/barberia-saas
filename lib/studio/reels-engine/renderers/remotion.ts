import type { ReelRenderer, ReelAssemblyInput, ReelAssemblyOutput, ReelJobStatus } from "../types";

// Stub — Remotion renders React components to MP4 server-side.
// Requires a self-hosted Lambda or Docker container running @remotion/renderer.
// Implement when self-hosted infrastructure is available.
export class RemotionRenderer implements ReelRenderer {
  async render(_input: ReelAssemblyInput): Promise<ReelAssemblyOutput> {
    throw new Error("RemotionRenderer not yet implemented");
  }
  async getStatus(_rendererJobId: string): Promise<ReelJobStatus> {
    throw new Error("RemotionRenderer not yet implemented");
  }
}
