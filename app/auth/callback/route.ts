import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function createSupabaseClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const errorRedirect = new URL("/login?error=oauth", origin);

  if (!code) {
    return NextResponse.redirect(errorRedirect);
  }

  const response = NextResponse.redirect(new URL("/dashboard", origin));
  const supabase = createSupabaseClient(request, response);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(errorRedirect);
  }

  const googleName =
    data.user.user_metadata?.full_name ??
    data.user.user_metadata?.name ??
    data.user.user_metadata?.preferred_username ??
    data.user.email?.split("@")[0] ??
    "";

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    full_name: googleName,
    email: data.user.email ?? null,
  });

  if (profileError) {
    console.error("Google auth profile upsert failed:", profileError.message);
  }

  return response;
}
