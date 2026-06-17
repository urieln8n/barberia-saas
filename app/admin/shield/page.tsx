import type { Metadata } from "next";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { ShieldAdminClient } from "./ShieldAdminClient";
import { getShieldManualReviewRequests } from "./data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shield Admin | BarberíaOS",
  description: "Panel interno para gestionar solicitudes manuales de BarberíaOS Shield.",
};

export default async function AdminShieldPage() {
  await requirePlatformAdmin();
  const { requests } = await getShieldManualReviewRequests();

  return <ShieldAdminClient requests={requests} />;
}
