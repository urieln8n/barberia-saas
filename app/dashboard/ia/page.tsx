import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { hasOpenAIKey } from "@/src/lib/ai/openai-client";
import { IADuenoClient } from "./IADuenoClient";

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
