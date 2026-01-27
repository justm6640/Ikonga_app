import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Debug logs for environment variables
    if (process.env.NODE_ENV === 'development') {
        console.log('[Middleware] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            // Silence specific common noise like missing/invalid refresh tokens
            if (error.code !== 'refresh_token_not_found' && error.code !== 'session_not_found') {
                console.error('[Middleware] Auth Error:', error.message)
            }
        }

        // 🔒 Route Protection
        const isProtectedRoute = ['/dashboard', '/onboarding', '/profile'].some(path =>
            request.nextUrl.pathname.startsWith(path)
        )

        // Special case: if we are in a protected route and have no user, redirect to login
        if (isProtectedRoute && !user) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/login'
            return NextResponse.redirect(redirectUrl)
        }

    } catch (err: any) {
        // Only log truly unexpected errors
        if (process.env.NODE_ENV === 'development') {
            console.error('[Middleware] Unexpected Error:', err.message || err)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
