import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const protectedRoutes = ['/'];
    const publicRoutes = ['/login', '/signup'];

    const { pathname } = request.nextUrl;

    const access_token = request.cookies.get('access_token')?.value;
    const refresh_token = request.cookies.get('refresh_token')?.value;

    if (protectedRoutes.includes(pathname) && !access_token && !refresh_token) return NextResponse.redirect(new URL('/login', request.url));
    if (publicRoutes.includes(pathname) && (access_token || refresh_token)) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/login', '/signup'],
}