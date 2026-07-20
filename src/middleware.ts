import { NextResponse, type NextRequest } from 'next/server';

function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return url.match(/https:\/\/([^.]+)\./)?.[1] ?? '';
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Inject x-sb-token header into cookie if present and no auth cookie exists
  const token = request.headers.get('x-sb-token');
  if (token) {
    const projectRef = getProjectRef();
    const cookieName = `sb-${projectRef}-auth-token`;
    const hasCookie = request.cookies.getAll().some((c) => c.name.includes('auth-token'));
    if (!hasCookie) {
      response.cookies.set(cookieName, token, { path: '/', sameSite: 'none', secure: true });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
