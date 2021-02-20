import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import styles from '../styles/utils.module.css'
import { useRouter } from 'next/router'
import { auth } from '../utils/firebase'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && router.push('/')
    })
  }, [])

  const logIn = async (e) => {
    e.preventDefault()
    try {
      await auth.signInWithEmailAndPassword(email, password)
      router.push('/')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
    <Header/>
      <div className={styles.userForm}>
        <h2 className={styles.userformTitle}>foodlistにログイン</h2>
          <form onSubmit={logIn} className={styles.userforms}>
            <div>
              <input
                id="email"
                type="email"
                className={styles.userform}
                placeholder="メールアドレス"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                className={styles.userform}
                placeholder="パスワード"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.userbutton}>
              ログイン
            </button>
          </form>
        <Link href="/signup">
          <a className={styles.userlink}>アカウント作成</a>
        </Link>
      </div>
    </div>
  )
}

export default Login
