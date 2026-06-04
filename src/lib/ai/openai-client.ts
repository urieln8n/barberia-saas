import "server-only";
import OpenAI from "openai";
import { OWNER_AI_RESPONSE_SCHEMA } from "./owner-ai-prompts";

export const DEFAULT_OWNER_AI_MODEL = "gpt-4o-mini";

let cachedClient: OpenAI | null = null;

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOwnerAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OWNER_AI_MODEL;
}

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }

  return cachedClient;
}

export async function createOwnerAIResponse({
  instructions,
  input,
}: {
  instructions: string;
  input: string;
}) {
  const client = getOpenAIClient();

  if (!client) {
    return {
      configured: false as const,
      model: getOwnerAIModel(),
      outputText: null,
      inputTokens: null,
      outputTokens: null,
    };
  }

  const model = getOwnerAIModel();
  const response = await client.responses.create({
    model,
    instructions,
    input,
    max_output_tokens: 900,
    store: false,
    text: {
      format: {
        type: "json_schema",
        name: "barberiaos_owner_ai_response",
        strict: true,
        schema: OWNER_AI_RESPONSE_SCHEMA,
      },
    },
  });

  return {
    configured: true as const,
    model,
    outputText: response.output_text ?? null,
    inputTokens: response.usage?.input_tokens ?? null,
    outputTokens: response.usage?.output_tokens ?? null,
  };
}
