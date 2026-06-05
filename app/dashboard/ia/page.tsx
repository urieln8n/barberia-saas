import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { hasOpenAIKey } from "@/src/lib/ai/openai-client";
import { IADuenoClient } from "./IADuenoClient";

export const metadata: Metadata = {
  title: "IA del Dueño | BarberíaOS",
  description: "Tu asistente IA analiza tu barbería y te dice qué hacer: huecos, clientes, promos y más.",
};

export const dynamic = "force-dynamic";

export default async function OwnerIaPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return <IADuenoClient openAIConfigured={hasOpenAIKey()} />;
}
