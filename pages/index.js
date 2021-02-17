import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../utils/firebase'
import Link from 'next/link'
import Header from '../components/Header'

export default function Home() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setCurrentUser(user) : router.push('/login')
    })
  }, [])

  const logOut = async () => {
    try {
      await auth.signOut()
      router.push('/login')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div>
      <Header/>
      <Link href="/lists/">
        <a>そこがリストだ</a>
      </Link>
      <pre>{currentUser && JSON.stringify(currentUser, null, 4)}</pre>
      <button onClick={logOut}>Logout</button>
    </div>
    

  )
}
