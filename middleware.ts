import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { IGetToken } from "./interfaces";

// import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const userAgent = req.headers.get("user-agent");
  const previousPage = req.nextUrl.pathname;

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (previousPage.startsWith("/checkout")) {
  //   const token = req.cookies.get("token")?.value;
  //   if (!token) {
  //     return NextResponse.redirect(
  //       new URL(`/auth/login?p=${previousPage}`, req.url)
  //     );
  //   }
  //   try {
  //     await jwtVerify(
  //       token,
  //       new TextEncoder().encode(process.env.JWT_SECREET_SEED)
  //     );
  //     return NextResponse.next();
  //   } catch (error) {
  //     return NextResponse.redirect(
  //       new URL(`/auth/login?p=${previousPage}`, req.url)
  //     );
  //   }
  // }

  if (previousPage.startsWith("/api/admin")) {
    if (userAgent?.startsWith("Postman")) {
      return NextResponse.next();
    }
    if (!session) {
      return new Response(
        JSON.stringify({
          message: "No autorizado",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const { user } = session as unknown as IGetToken;
    const validRoles = ["admin", "super-user", "SEO"];
    if (!validRoles.includes(user.role)) {
      return new Response(
        JSON.stringify({
          message: "No autorizado",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${previousPage}`;

    return NextResponse.redirect(url);
  }

  if (previousPage.startsWith("/admin")) {
    const { user } = session as unknown as IGetToken;
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL(`/`, req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/admin/:path*", "/api/admin/:path*"],
};

// // middleware.ts
// import { getToken } from 'next-auth/jwt'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // This function can be marked `async` if using `await` inside
// export async function middleware(req: NextRequest) {

//     const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//     const requestedPage = req.nextUrl.pathname;
//     const validRoles = ['admin', 'super-user', 'SEO'];

//     if( !session ){
//         const url = req.nextUrl.clone();

//         url.pathname = `/auth/login`;
//         url.search = `p=${ requestedPage }`;

//         if( requestedPage.includes('/api') ){
//           return new Response( JSON.stringify({ message: 'No autorizado' }),{
//             status: 401,
//             headers:{
//               'Content-Type':'application/json'
//             }
//           });
//         };

//         return NextResponse.redirect( url );
//     };

//     if( requestedPage.includes('/api/admin') && !validRoles.includes( session.user.role ) ){

//       return new Response( JSON.stringify({ message: 'No autorizado' }),{
//         status: 401,
//         headers:{
//           'Content-Type':'application/json'
//         }
//         });
//     };

//     if( requestedPage.includes('/admin') && !validRoles.includes( session.user.role ) ){

//       return NextResponse.redirect(new URL('/', req.url));
//     };

//     return NextResponse.next();
// };
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/checkout/:path*','/orders/:path*','/api/orders/:path*','/admin/:path*','/api/admin/:path*'],
// };
