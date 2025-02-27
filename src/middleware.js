import { NextResponse } from "next/server";

export async function middleware(request) {
  try {
    const authCheckResponse = await fetch(
      "http://localhost:8001/api/checkAuth",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!authCheckResponse.ok) {
      throw new Error("Failed to fetch authentication data");
    }

    const authData = await authCheckResponse.json();

    if (!authData.isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error during fetch:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/uploadteams/:path*",
};
