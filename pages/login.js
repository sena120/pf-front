import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
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
    <div className="wrapper">
    <Header/>
      <form className="auth" onSubmit={logIn}>
        <div>
          <label htmlFor="email" className="auth-label">
            Email:{' '}
          </label>
          <input
            id="email"
            className="auth-input"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="password" className="auth-label">
            Password:{' '}
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="auth-btn" type="submit">
          Login
        </button>
      </form>
      <Link href="/signup">
        <a className="auth-link">新規登録</a>
      </Link>
    </div>
  )
}

export default Login
