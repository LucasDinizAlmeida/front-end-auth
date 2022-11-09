// import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
// import { parseCookies } from "nookies";

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";


// export function withSSRGuest<P>(fn: GetServerSideProps<P>) {

//   return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
//     const cookies = parseCookies(ctx)

//     if (cookies['nextauth.token']) {
//       return {
//         redirect: {
//           destination: '/dashboard',
//           permanent: false
//         }
//       }
//     }

//     return await fn(ctx)
//   }
// }


export function withSSRGuest(fn: GetServerSideProps): GetServerSideProps {

  return async (ctx: GetServerSidePropsContext) => {
    const cookies = parseCookies(ctx)

    if (cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    }

    return await fn(ctx)
  }
}