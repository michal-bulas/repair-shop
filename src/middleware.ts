import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth(async function middleware() {}, {
  isReturnToCurrentPage: true
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - API routes
     * - _next/static
     * - _next/image
     * - auth
     * - favicon.ico
     * - robots.txt
     * - images
     * - login
     * - homepage
     */
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|login|$).*)'
  ]
};
