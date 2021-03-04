import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../utils/firebase'
import Link from 'next/link'
import axios from 'axios'
import Listsflame from '../components/Listsflame'
import styles from '../styles/utils.module.css'

export default function Home() {
  const router = useRouter()
  const [userId, setUserId] = useState()
  const [menuLists, setMenuLists] = useState([]) //APIから取得したmenulistのデータ
  const [foodLists, setFoodLists] = useState([]) //APIから取得したfoodlistのデータ
  const [buyLists, setBuyLists] = useState([]) //APIから取得したbuylistのデータ
  const [selectedList, setSelectedList] = useState('Food') //現在選択されているListを判断する
  const [selectedCategory, setSelectedCategory] = useState() //現在選択されているCategoryを判断する
  const [addState, setAddState] = useState(false) //ListItemを追加するformの状態
  // const [currentUser, setCurrentUser] = useState(null)

  //初回のレンダーでAPIからデータを取得
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // setCurrentUser(user)
        // const userMail = user.email
        axios
          .get('http://localhost:3001/users', {
            params: { email: 'test@co.jp' },
          })
          .then((results) => {
            console.log(results.data.data)
            setUserId(results.data.data.id)
            // setMenuLists(results.data.data.menulists)
            setFoodLists(results.data.data.foodlists)
            setBuyLists(results.data.data.buylists)
          })
      } else {
        router.push('/login')
      }
    })
  }, [])

  //カテゴリ、アイテムの変更を処理する。
  const changeListsState = (newData) => {
    if (selectedList === 'Menu') {
      return setMenuLists(newData)
    }
    if (selectedList === 'Food') {
      return setFoodLists(newData)
    }
    if (selectedList === 'Buy') {
      return setBuyLists(newData)
    }
  }

  const changeList = (list) => {
    if (selectedList !== list) {
      setSelectedList(list)
      setAddState(false) //他のリストが選択されたとき、Addを閉じる
    }
  }

  const changeCategory = (id) => {
    setSelectedCategory(id)
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
      router.push('/login')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div>
      <div className={styles.tools}>
        <div>
          <input type='text' />
        </div>
        <div>
          <button onClick={toggleAdd}>add</button>
          <button>deleat</button>
        </div>
      </div>

      <div className={styles.listsContainer}>
        {/* <Listsflame type="Menu" categorys={menuLists} /> */}

        <Listsflame
          type='Food'
          add={addState}
          userId={userId}
          listData={foodLists}
          changeList={changeList}
          selectedList={selectedList}
          changeCategory={changeCategory}
          selectedCategory={selectedCategory}
          changeListsState={changeListsState}
        />

        <Listsflame
          type='Buy'
          add={addState}
          userId={userId}
          listData={buyLists}
          changeList={changeList}
          selectedList={selectedList}
          changeCategory={changeCategory}
          selectedCategory={selectedCategory}
          changeListsState={changeListsState}
        />
      </div>

      <button onClick={logOut}>Logout</button>
      <Link href='/test/'>
        <a>そこが訓練場だ</a>
      </Link>
    </div>
  )
}
