import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Get role once for all checks
  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    role = profile?.role ?? 'user';
  }

  // /dashboard — must be logged in and NOT admin
  if (path.startsWith('/dashboard')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
    if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
  }

  // /admin — must be admin
  if (path.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
    if (role !== 'admin') return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect logged-in users away from login/registro
  if (path === '/login' || path === '/registro') {
    if (user) return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/registro'],
};
