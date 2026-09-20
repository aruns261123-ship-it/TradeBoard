import { auth } from "@/auth";
import { isProtectedRoute } from "@/auth.config";

export default auth((req) => {
  const isSignedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (isProtectedRoute(pathname) && !isSignedIn) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signInUrl);
  }

  if (pathname.startsWith("/admin") && req.auth?.user?.role !== "admin") {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/post-a-job", "/admin/:path*", "/admin"],
};
