import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico   (browser tab icon)
     * - icon.svg      (app icon)
     * - Any file with an extension (images, fonts, etc.)
     *
     * This ensures the session is refreshed on every page navigation
     * without intercepting static asset requests.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
