import Router from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/apiClient";
import { setCookie, parseCookies, destroyCookie } from 'nookies'

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

interface CredentialsProps {
  email: string,
  password: string
}

interface AuthContextProps {
  sigIn(credentials: CredentialsProps): Promise<void>;
  isAuthenticated: boolean;
  user: User
}

interface AuthContextProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export function sigOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  Router.push('/')
}



export function AuthContextProvider({ children }: AuthContextProviderProps) {


  const [user, setUser] = useState<User>({} as User)
  const isAuthenticated = !!user.email

  async function sigIn({ email, password }: CredentialsProps) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const { permissions, roles, token, refreshToken } = response.data

      setUser({
        email,
        permissions,
        roles
      })

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()
    if (token) {
      api.get('me')
        .then(response => {
          const { email, permissions, roles } = response.data

          setUser({ email, permissions, roles })

        }).catch(() => {
          sigOut()
        })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ sigIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const UseAuth = () => useContext(AuthContext)