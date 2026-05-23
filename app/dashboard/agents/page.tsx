import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { AgentsClient } from "./AgentsClient";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return <AgentsClient />;
}
