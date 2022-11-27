
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";
import decode from 'jwt-decode';
import { validateUserPermissions } from "./validateUserPermissions";

interface WithSSRAuthOptions {
  permissions: string[];
  roles: string[];
}


export function withSSRAuth(fn: GetServerSideProps, options?: WithSSRAuthOptions): GetServerSideProps {

  return async (ctx: GetServerSidePropsContext) => {
    const cookies = parseCookies(ctx)

    const token = cookies['nextauth.token']

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    if (options) {
      const user = decode<{ permissions: string[], roles: string[] }>(token)

      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions: options?.permissions,
        roles: options?.roles
      })

      if (!userHasValidPermissions) {
        return {
          props: {},
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }
    }



    try {
      return await fn(ctx)

    } catch (error) {
      if (error instanceof AuthTokenError) {

        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refreshToken')

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
      return {
        props: {}
      }
    }
  }
}