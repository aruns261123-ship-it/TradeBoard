export const authRoutes = ["/signin", "/signup"];
export const protectedRoutes = ["/dashboard", "/admin"];

export function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}
