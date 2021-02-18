import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import { auth } from '../utils/firebase'
import { AuthContext } from '../auth/AuthProvider'

const SignUp = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && router.push('/')
    })
  }, [])

  const createUser = async (e) => {
    e.preventDefault()
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      router.push('/login')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
    <Header/>
      <form onSubmit={createUser}>
        <div>
          <label htmlFor="name" >
            ユーザー名:{' '}
          </label>
          <input
            id="name"
            type="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" >
            メール:{' '}
          </label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">
            パスワード:{' '}
          </label>
          <input
            id="password"
            
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          登録
        </button>
      </form>
      <Link href="/login">
        <a>ログインページへ</a>
      </Link>
    </div>
  )
}

export default SignUp