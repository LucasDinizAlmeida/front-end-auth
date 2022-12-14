import { getApi } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Metrics() {


  return (
    <>
      <h1>Metricas</h1>
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
}, {
  permissions: ['metrics.list'],
  roles: ['administrator', 'editor']
})