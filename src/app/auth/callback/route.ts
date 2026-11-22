import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/home";
  if (!code) return NextResponse.redirect(new URL("/login", request.url));
  const response = NextResponse.redirect(new URL(next, request.url));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "public-anon-placeholder",
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => cookiesToSet.forEach(({name,value,options}) => response.cookies.set(name,value,options)),
      },
    },
  );
  await supabase.auth.exchangeCodeForSession(code);
  return response;
}
