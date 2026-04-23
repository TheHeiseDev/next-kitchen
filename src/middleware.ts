import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt";

export  const middleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    const token = await getToken({req: request, secret: process.env.AUTH_SECRET! });
    const protectedRoutes = ['/ingredients'];

    if(protectedRoutes.some((route) => pathname.startsWith(route))) {
        if(!token) {
            const url = new URL("/error", request.url);
            url.searchParams.set("message", "Недостаточно прав");

            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/ingredients']
}