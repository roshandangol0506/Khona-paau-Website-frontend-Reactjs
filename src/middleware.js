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

    // Restrict uploadteams to admin (login)
    if (request.nextUrl.pathname.startsWith("/uploadteams")) {
      if (!authData.isAuthenticated || authData.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Restrict uploadreviews to normal users (user_login)
    if (request.nextUrl.pathname.startsWith("/uploadreviews")) {
      if (!authData.isAuthenticated || authData.role !== "user") {
        return NextResponse.redirect(new URL("/user_login", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error during fetch:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/uploadteams/:path*", "/uploadreviews/:path*"],
};
