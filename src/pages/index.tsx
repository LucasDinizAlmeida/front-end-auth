import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { FormEvent, useState } from 'react'
import styles from '../../styles/Home.module.css'
import { UseAuth } from '../Context/AuthContext'
import { withSSRGuest } from '../utils/withSSRGuest'
// import { withSSRGuest } from '../utils/withSSRGuest'

interface extensao {
  [key: string]: any
}

interface Props extends extensao {
  users: string[]
}

export default function Home() {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { sigIn } = UseAuth()


  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    sigIn({
      email,
      password
    })
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.content}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <button type='submit'>Enviar</button>
      </form>
    </div>
  )
}


export const getServerSideProps = withSSRGuest(async (ctx) => {

  

  return {
    props: {}
  } 
})

// export const getServerSideProps: GetServerSideProps = withSSRGuest(async (ctx) => {

  

//   return {
//     props: {}
//   }
// })
