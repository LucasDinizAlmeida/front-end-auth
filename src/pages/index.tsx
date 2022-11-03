import Head from 'next/head'
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import styles from '../../styles/Home.module.css'
import { UseAuth } from '../Context/AuthContext'

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
