import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../utils/firebase'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import Listsflame from '../components/Listsflame'
import styles from '../styles/utils.module.css'

export default function Home() {
  const router = useRouter()
  const [menuLists, setMenuLists] = useState([]) //各リストのデータ
  const [foodLists, setFoodLists] = useState([]) //
  const [buyLists, setBuyLists] = useState([]) //
  const [allFoodItems, setAllFoodItems] = useState([]) //すべてのFoodアイテム
  const [allBuyItems, setAllBuyItems] = useState([]) //すべてのBuyアイテム
  const [selectedMenuCategory, setSelectedMenuCategory] = useState() //各リストの選択されているカテゴリー
  const [selectedFoodCategory, setSelectedFoodCategory] = useState() //
  const [selectedBuyCategory, setSelectedBuyCategory] = useState() //
  const [deleteMenuItems, setDeleteMenuItems] = useState([]) //各リストの削除予定のアイテム
  const [deleteFoodItems, setDeleteFoodItems] = useState([]) //
  const [deleteBuyItems, setDeleteBuyItems] = useState([]) //
  const [userId, setUserId] = useState() //rails側のユーザーid
  const [selectedList, setSelectedList] = useState('Food') //現在選択されているリストを判断する
  const [addState, setAddState] = useState(false) //アイテムを追加するformの状態
  const [searchWord, setSearchWord] = useState([])
  // const [currentUser, setCurrentUser] = useState(null)

  //ログインしたユーザーであればAPIからデータを取得
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
            setMenuLists(results.data.data.menulists)
            setFoodLists(results.data.data.foodlists)
            setBuyLists(results.data.data.buylists)
            setSelectedMenuCategory(results.data.data.menulists[0].id)
            setSelectedFoodCategory(results.data.data.foodlists[0].id)
            setSelectedBuyCategory(results.data.data.buylists[0].id)
          })
      } else {
        router.push('/login')
      }
    })
  }, [])

  //検索されたアイテム名が存在すれば、そのリストに移動する処理
  useEffect(() => {
    const mutchFoodItem = allFoodItems.find((item) => item.item === searchWord)
    if (mutchFoodItem) {
      setSelectedFoodCategory(mutchFoodItem.foodlist_id)
    }
    const mutchBuyItem = allBuyItems.find((item) => item.item === searchWord)
    if (mutchBuyItem) {
      setSelectedBuyCategory(mutchBuyItem.buylist_id)
    }
  }, [searchWord])

  //カテゴリ、アイテムの変更を反映する
  const changeListsState = (newData) => {
    if (selectedList === 'Menu') {
      return setMenuLists(newData)
    } else if (selectedList === 'Food') {
      return setFoodLists(newData)
    } else if (selectedList === 'Buy') {
      return setBuyLists(newData)
    }
  }

  //チェック済みのアイテムを削除する
  const deleteItem = () => {
    let listType
    let ids
    if (selectedList === 'Menu') {
      listType = 'menuitems'
      ids = deleteMenuItems
    } else if (selectedList === 'Food') {
      listType = 'fooditems'
      ids = deleteFoodItems
    } else if (selectedList === 'Buy') {
      listType = 'buyitems'
      ids = deleteBuyItems
    }
    axios
      .delete(`http://localhost:3001/${listType}/${ids}`, { params: { ids: ids, userId: userId } })
      .then((results) => {
        if (selectedList === 'Menu') {
          console.log(results)
          setDeleteMenuItems([])
          setMenuLists(results.data.data)
        } else if (selectedList === 'Food') {
          console.log(results)
          setDeleteFoodItems([])
          setFoodLists(results.data.data)
        } else if (selectedList === 'Buy') {
          console.log(results)
          setDeleteBuyItems([])
          setBuyLists(results.data.data)
        }
      })
      .catch((data) => {
        console.log(data)
      })
  }

  //選択されているリストを判定する処理
  const changeList = (type) => {
    if (type !== selectedList) {
      setSelectedList(type)
      setAddState(false) //他のリストが選択されたとき、Addを閉じる
    }
  }

  // 選択されているカテゴリーを変更
  const changeCategory = (id, type) => {
    if (type !== selectedList) {
      if (type === 'Menu') {
        return setSelectedMenuCategory(id)
      } else if (type === 'Food') {
        return setSelectedFoodCategory(id)
      } else if (type === 'Buy') {
        return setSelectedBuyCategory(id)
      }
    } else {
      if (selectedList === 'Menu') {
        return setSelectedMenuCategory(id)
      } else if (selectedList === 'Food') {
        return setSelectedFoodCategory(id)
      } else if (selectedList === 'Buy') {
        return setSelectedBuyCategory(id)
      }
    }
  }

  //検索欄の文字をセット
  const inputSearchWord = (e) => {
    setSearchWord(e.target.value)
  }

  //検索欄のEnter無効
  const stopSubmit = (e) => {
    e.preventDefault()
  }

  //アイテム追加フォームの開閉処理
  const toggleAdd = () => {
    setAddState(!addState)
  }

  //ログアウトして、ログインページへ遷移する
  const logOut = async () => {
    try {
      await auth.signOut()
      router.push('/login')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className={styles.body}>
      <Head>
        <title>Foodlist</title>
        <style>
          {`
            #__next { height: 100% }
          `}
        </style>
      </Head>
      {/* Header的な場所 */}
      <div className={styles.title}>
        <h2 className={styles.titleName}>Foodlist</h2>
        <div>=</div>
        <button onClick={logOut}>Logout</button>
      </div>

      {/* 検索欄 */}
      <form className={styles.serch} onSubmit={stopSubmit}>
        <input
          className={styles.serchInput}
          type='search'
          placeholder='食材を検索'
          onChange={inputSearchWord}
        />
      </form>

      {/* アイテム追加ボタン */}
      <div className={styles.buttons}>
        <div className={styles.add} onClick={toggleAdd}>
          <div>+</div>
        </div>

        {/* アイテム削除ボタン */}
        <div className={styles.delete} onClick={deleteItem}>
          <Image src='/icon_119870_128.png' height={30} width={30} quality={100} />
        </div>
      </div>

      {/* 各リスト */}
      <div className={styles.listsContainer}>
        <Listsflame
          type='Menu'
          add={addState}
          userId={userId}
          listData={menuLists}
          searchWord={searchWord}
          selectedCategory={selectedMenuCategory}
          deleteItems={deleteMenuItems}
          changeList={changeList}
          selectedList={selectedList}
          changeCategory={changeCategory}
          changeListsState={changeListsState}
        />

        <Listsflame
          type='Food'
          add={addState}
          userId={userId}
          listData={foodLists}
          allItems={allFoodItems}
          searchWord={searchWord}
          selectedCategory={selectedFoodCategory}
          deleteItems={deleteFoodItems}
          changeList={changeList}
          selectedList={selectedList}
          changeCategory={changeCategory}
          changeListsState={changeListsState}
          setAllFoodItems={setAllFoodItems}
        />

        <Listsflame
          type='Buy'
          add={addState}
          userId={userId}
          listData={buyLists}
          allItems={allBuyItems}
          searchWord={searchWord}
          selectedCategory={selectedBuyCategory}
          deleteItems={deleteBuyItems}
          changeList={changeList}
          selectedList={selectedList}
          changeCategory={changeCategory}
          changeListsState={changeListsState}
          setAllBuyItems={setAllBuyItems}
        />
      </div>
    </div>
  )
}
