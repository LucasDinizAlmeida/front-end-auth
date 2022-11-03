import { useEffect } from "react"
import { UseAuth } from "../Context/AuthContext"
import { api } from "../services/api"


export default function Dashboard() {

  const { user } = UseAuth()

  useEffect(() => {
    api.get('me')
      .then(response => console.log(response))
  }, [])

  return (
    <h1>Dashboard: {user.email}</h1>
  )
}