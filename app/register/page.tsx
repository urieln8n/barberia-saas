import { redirect } from "next/navigation";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const planParam = searchParams.plan ? `&plan=${searchParams.plan}` : "";
  redirect(`/login?tab=register${planParam}`);
}
