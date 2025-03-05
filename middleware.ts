// 여기서 NextAuth 함수를 authConfig(auth.config.ts)로 초기화 하고, auth 함수를 export합니다
// 또한, matcher를 사용해서, 이 middleware가 어떤 경로에서 작동할지 정의합니다.
// 이러한 미들웨어를 채택하는 가장 큰 장점은, 보호된 경로를 Middleware가 authenticate 하기전엔
// 시작도 안한다는 것입니다.

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};