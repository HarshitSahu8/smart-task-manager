import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (
    !session &&
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/signup"
  ) {
    const loginUrl = new URL("/login", req.url);
    // redirect to the login page with the current path as a query parameter
    if (req.nextUrl.search) {
      loginUrl.searchParams.set(
        "redirect",
        req.nextUrl.pathname + req.nextUrl.search
      );
    }
    return NextResponse.redirect(loginUrl);
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
