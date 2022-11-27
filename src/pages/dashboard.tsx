import { useEffect } from "react"
import { Can } from "../components/Can"
import { UseAuth } from "../Context/AuthContext"
import { useCan } from "../hooks/usecCan"
import { getApi } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {

  const { user, sigOut } = UseAuth()



  useEffect(() => {
    api.get('me')
      .then(response => console.log(response))
  }, [])

  return (
    <>
      <h1>Dashboard: {user.email}</h1>
      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>

      <button onClick={sigOut}>
        SignOut
      </button>

    </>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {
  const api = getApi(ctx)

  const response = await api.get('/me')
  console.log(response.data)


  return {
    props: {}
  }
})