import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import styles from '../styles/utils.module.css'
import { auth } from '../utils/firebase'
import { AuthContext } from '../auth/AuthProvider'
import axios from 'axios'

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
      axios.post('http://localhost:3001/users', {name: name, email: email})
      router.push('/login')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
    <Header/>
    <div className={styles.userForm}>
    <h2 className={styles.userformTitle}>アカウントを作成</h2>
      <form onSubmit={createUser} className={styles.userforms}>
        <div>
          <input
            id="name"
            name="user[name]"
            type="text"
            className={styles.userform}
            placeholder="ユーザーネーム"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            id="email"
            name="user[email]"
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
        {/* <div>
          <label htmlFor="password">
            確認用パスワード:{' '}
          </label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div> */}
        <button type="submit" className={styles.userbutton}>
          登録
        </button>
      </form>
      <Link href="/login">
        <a className={styles.userlink}>ログインページへ</a>
      </Link>
      </div>
    </div>
  )
}

export default SignUp