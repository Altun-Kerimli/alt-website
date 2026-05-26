import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import createMiddleware from "next-intl/middleware";

// 1. Initialize the next-intl language router
const intlMiddleware = createMiddleware({
  locales: ['en', 'tr', 'az', 'uk', 'ru', 'de'],
  defaultLocale: 'en'
});

// 2. The main traffic cop (handles the language URL rewriting)
export default async function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

// 3. Your existing secure bouncer (completely untouched)
export async function enforceBouncer() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

// 4. Configuration to tell the proxy to ignore API routes and static files
export const config = {
  matcher: ['/((?!api|admin|login|_next|_vercel|.*\\..*).*)']
};