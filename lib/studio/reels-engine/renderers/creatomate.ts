import type { ReelRenderer, ReelAssemblyInput, ReelAssemblyOutput, ReelJobStatus } from "../types";

// Stub — Creatomate is a REST API similar to Shotstack with a template-first model.
// Implement as a drop-in replacement if Shotstack pricing becomes a concern at scale.
// API docs: https://creatomate.com/docs/api
export class CreatomateRenderer implements ReelRenderer {
  async render(_input: ReelAssemblyInput): Promise<ReelAssemblyOutput> {
    throw new Error("CreatomateRenderer not yet implemented");
  }
  async getStatus(_rendererJobId: string): Promise<ReelJobStatus> {
    throw new Error("CreatomateRenderer not yet implemented");
  }
}
