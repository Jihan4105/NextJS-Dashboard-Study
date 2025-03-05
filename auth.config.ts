import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  // 이 callback은 request가 Authorized되었는지 확인하기위해 사용되는 NextJS Middleware입니다.
  // request가 완료되기 전에, 불려져서 auth와 request를 인자로 받습니다.
  // auth prop은 유저의 세션을 가지고 있고, request prop은 다음 요청을 가지고 있습니다.
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  // Providers 옵션은 다른 로그인 옵션들을 정의하는데 사용합니다. 
  // 예를들어서 구글이나 github계정을 이용한 로그인을 추가할 수 있습니다.
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;