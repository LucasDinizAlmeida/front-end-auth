import axios, { AxiosError } from 'axios';
import { getPageStaticInfo } from 'next/dist/build/analysis/get-page-static-info';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { sigOut } from '../Context/AuthContext';
import { AuthTokenError } from '../errors/AuthTokenError';

interface AxiosErrorResponse {
  code?: string;
}

interface failedRequestsQueueData {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}



let isRefreshing = false
let failedRequestsQueue: failedRequestsQueueData[] = []

export function getApi(ctx: any = undefined) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`
    }
  })

  api.interceptors.response.use(response => {
    return response
  }, (error: AxiosError<AxiosErrorResponse>) => {
    if (error.response?.status === 401) {
      if (error.response!.data.code === 'token.expired') {

        cookies = parseCookies(ctx)

        const { 'nextauth.refreshToken': refreshToken } = cookies
        let originalConfig = error.config

        if (!isRefreshing) {
          isRefreshing = true

          api.post('refresh', {
            refreshToken
          }).then(response => {
            const { token, refreshToken } = response.data

            setCookie(ctx, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            })

            setCookie(ctx, 'nextauth.refreshToken', refreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            failedRequestsQueue.forEach(request => request.onSuccess(token))
            failedRequestsQueue = []
          })
            .catch(err => {
              failedRequestsQueue.forEach(request => request.onFailure(err))
              failedRequestsQueue = []

              if (process.browser) {
                console.log('o sigOut vem daqui.')
                sigOut()
              }

            })
            .finally(() => {
              isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              if (!originalConfig?.headers) {
                return
              }

              originalConfig.headers['Authorization'] = `Bearer ${token}`

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        })
      } else {
        if (process.browser) {
          console.log('Negativo, o signOut vem daqui.')
          sigOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }

      return Promise.reject(error)
    }
  })

  return api

}

