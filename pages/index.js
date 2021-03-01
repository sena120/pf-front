import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/router"
import { auth } from "../utils/firebase"
import Link from "next/link"
import Header from "../components/Header"
import axios from "axios"
import Listsflame from "../components/Listsflame"
import styles from "../styles/utils.module.css"

export default function Home() {
  const router = useRouter()
  const [menuLists, setMenuLists] = useState([])
  const [foodLists, setFoodLists] = useState([])
  const [buyLists, setBuyLists] = useState([])
  const [selectList, setSelectList] = useState("")
  const [selectCategory, setSelectCategory] = useState("")
  const [addState, setAddState] = useState(false)
  // const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // setCurrentUser(user)
        // const userMail = user.email
        axios
          .get("http://localhost:3001/users", {
            params: { email: "test@co.jp" },
          })
          .then((results) => {
            console.log(results.data.data)
            // setMenuLists(results.data.data.menulists)
            setFoodLists(results.data.data.foodlists)
            setBuyLists(results.data.data.buylists)
          })
      } else {
        router.push("/login")
      }
    })
  }, [])

  const select = () => {
    setSelectList("food")
  }

  const category = (number) => {
    setSelectCategory(number)
    if (addState === true) {
      setAddState(false)
    }
  }

  const toggleAdd = () => {
    setAddState(!addState)
  }

  const logOut = async () => {
    try {
      await auth.signOut()
      router.push("/login")
    } catch (error) {
      alert(error.message)
    }
  }

  // console.log(Lists.foodlists)

  return (
    <div>
      <div className={styles.tools}>
        <div>
          <input type="text" />
        </div>
        <div>
          <button onClick={toggleAdd}>add</button>
          <button>deleat</button>
        </div>
      </div>

      <div className={styles.listsContainer}>
        {/* <Listsflame type="Menu" categorys={menuLists} /> */}
        <Listsflame
          type="Food"
          categorys={foodLists}
          select={category}
          add={addState}
          selectCategory={selectCategory}
          onClick={select}
        />
        <Listsflame
          type="Buy"
          categorys={buyLists}
          select={category}
          add={addState}
          selectCategory={selectCategory}
        />
      </div>
      {/* <pre>{currentUser && JSON.stringify(currentUser, null, 4)}</pre> */}
      <button onClick={logOut}>Logout</button>
      <Link href="/test/">
        <a>そこが訓練場だ</a>
      </Link>
    </div>
  )
}
