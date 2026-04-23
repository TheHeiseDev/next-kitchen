import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// ✅ функция переименована: middleware → proxy
export const proxy = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        return NextResponse.redirect(new URL("/error", request.url));
    }

    let token = null;
    try {
        token = await getToken({ req: request, secret });
    } catch (err) {
        console.error("Ошибка в getToken:", err);
        return NextResponse.redirect(new URL("/error", request.url));
    }

    const protectedMatcher = /^\/ingredients(\/.*)?$/;
    if (protectedMatcher.test(pathname) && !token) {
        const url = new URL("/error", request.url);
        url.searchParams.set("message", "Недостаточно прав");
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/ingredients/:path*'], // ✅ правильный синтаксис для подпутей
};