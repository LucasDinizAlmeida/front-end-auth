import { getApi } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {

  // const { user } = UseAuth()

  // useEffect(() => {
  //   api.get('me')
  //     .then(response => console.log(response))
  // }, [])

  return (
    <h1>Dashboard</h1>
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