import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";

// ✅ функция переименована: middleware → proxy
export const proxy = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    let session = null;

    try {
        session = await auth();
    } catch (error) {
        console.error("Ошибка в auth() внутри proxy:", error);
        return NextResponse.redirect(new URL("/error", request.url));
    }

    const protectedMatcher = /^\/ingredients(\/.*)?$/;
    if (protectedMatcher.test(pathname) && !session?.user) {
        const url = new URL("/error", request.url);
        url.searchParams.set("message", "Недостаточно прав");
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/ingredients/:path*'], // ✅ правильный синтаксис для подпутей
};