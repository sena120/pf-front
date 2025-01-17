import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../utils/firebase'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import Listsflame from '../components/Listsflame'
import styles from '../styles/utils.module.css'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [menuLists, setMenuLists] = useState([]) //各リストのデータ
  const [foodLists, setFoodLists] = useState([]) //
  const [buyLists, setBuyLists] = useState([]) //
  const [allMenuItems, setAllMenuItems] = useState([]) //すべてのMenuアイテム
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
  const [openHumberger, setOpenHumberger] = useState(false)
  const [searchWord, setSearchWord] = useState([])

  //ログインしたユーザーであればAPIからデータを取得
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userMail = user.email
        const getData = async () => {
          await axios
            .get(`${process.env.RAILS_API}users`, {
              params: { email: userMail },
            })
            .then((results) => {
              // console.log(results.data.data)
              setUserId(results.data.data.id)
              setMenuLists(results.data.data.menulists)
              setFoodLists(results.data.data.foodlists)
              setBuyLists(results.data.data.buylists)
              setSelectedMenuCategory(results.data.data.menulists[0].id)
              setSelectedFoodCategory(results.data.data.foodlists[0].id)
              setSelectedBuyCategory(results.data.data.buylists[0].id)
            })
        }
        getData()
        const scrollArea = document.getElementById('scroll-area')
        scrollArea.scrollTo((900 - scrollArea.offsetWidth) / 2, 0)
      } else {
        router.push('/login')
      }
    })
  }, [])

  //検索されたアイテム名が存在すれば、そのリストに移動する処理
  useEffect(() => {
    const mutchMenuItem = allMenuItems.find((item) => item.foods.includes(searchWord))
    if (mutchMenuItem) {
      setSelectedMenuCategory(mutchMenuItem.menulist_id)
    }
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
  const changeListsState = (newData, action) => {
    if (action === 'addBuyFromMenu') {
      const listData = buyLists.slice()
      const categoryIndex = buyLists.findIndex((category) => category.id === selectedBuyCategory)
      listData[categoryIndex].buyitems.push(newData)
      setBuyLists(listData)
    } else if (action === 'deleteBuy') {
      setBuyLists(newData)
    } else if (action === 'addFoodFromBuy') {
      const listData = foodLists.slice()
      const categoryIndex = foodLists.findIndex((category) => category.id === selectedFoodCategory)
      listData[categoryIndex].fooditems.push(newData)
      setFoodLists(listData)
    } else {
      if (selectedList === 'Menu') {
        setMenuLists(newData)
      } else if (selectedList === 'Food') {
        setFoodLists(newData)
      } else if (selectedList === 'Buy') {
        setBuyLists(newData)
      }
    }
  }

  //チェック済みのアイテムを削除する
  const deleteItem = async () => {
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
    if (ids.length === 0) {
      return
    } else {
      await axios
        .delete(`${process.env.RAILS_API}${listType}/${ids}`, {
          params: { ids: ids, user_id: userId },
        })
        .then((results) => {
          if (selectedList === 'Menu') {
            setDeleteMenuItems([])
            setMenuLists(results.data.data)
          } else if (selectedList === 'Food') {
            setDeleteFoodItems([])
            setFoodLists(results.data.data)
          } else if (selectedList === 'Buy') {
            setDeleteBuyItems([])
            setBuyLists(results.data.data)
          }
        })
        .catch((data) => {
          console.log(data)
        })
    }
  }

  //選択されているリストを変更する処理
  const changeList = (type) => {
    if (type !== selectedList) {
      setSelectedList(type)
      setAddState(false) //他のリストが選択されたとき、Addを閉じる
      scrollList(type)
    }
  }

  //リストがタッチされたらスクロールする処理
  const scrollList = (type) => {
    const scrollArea = document.getElementById('scroll-area')
    const scrollWidth = 900 - scrollArea.offsetWidth
    if (type === 'Menu') {
      scrollArea.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    } else if (type === 'Food') {
      scrollArea.scrollTo({ top: 0, left: (900 - scrollArea.offsetWidth) / 2, behavior: 'smooth' })
    } else if (type === 'Buy') {
      scrollArea.scrollTo({ top: 0, left: scrollWidth, behavior: 'smooth' })
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

  //検索欄に入力された文字をセット
  const inputSearchWord = (e) => {
    setSearchWord(e.target.value)
  }

  //検索ボタンの処理
  const searchButton = (name) => {
    setSearchWord('')
    setSearchWord(name)
  }

  //検索欄のEnter無効
  const stopSubmit = (e) => {
    e.preventDefault()
  }

  //アイテム追加フォームの開閉処理
  const toggleAdd = () => {
    setAddState(!addState)
  }

  //ハンバーガーメニューの開閉
  const toggleHumberger = () => {
    setOpenHumberger(!openHumberger)
  }

  //スマホでフリックしたら選択されているリストを変更する
  const scrollMain = () => {
    const scrollArea = document.getElementById('scroll-area')
    const scrollWidth = 900 - scrollArea.offsetWidth
    const scroll = scrollArea.scrollLeft
    if (scroll < scrollWidth / 4) {
      if (selectedList !== 'Menu') setAddState(false)
      setSelectedList('Menu')
    } else if (scroll > (scrollWidth / 4) * 3) {
      if (selectedList !== 'Buy') setAddState(false)
      setSelectedList('Buy')
    } else {
      if (selectedList !== 'Food') setAddState(false)
      setSelectedList('Food')
    }
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

  let humbergerStyle
  let humbergerNavStyle
  let humBackStyle
  openHumberger
    ? ((humbergerStyle = styles.asideMenu),
      (humbergerNavStyle = styles.openHumberger),
      (humBackStyle = styles.openHumBack))
    : ((humbergerStyle = styles.closedAsideMenu),
      (humbergerNavStyle = styles.closedHumberger),
      (humBackStyle = styles.closeHumBack))

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
      {/* Header */}
      <header className={styles.header}>
        <h2 className={styles.titleName}>Foodlist</h2>
        {/* whithが905px以上 */}
        <nav className={styles.headerNavi}>
          <Link href='/header/about'>
            <a className={styles.naviRoute}>About</a>
          </Link>
          <Link href='/header/help'>
            <a className={styles.naviRoute}>Help</a>
          </Link>
          <span className={styles.naviRoute} onClick={logOut}>
            ログアウト
          </span>
        </nav>

        {/* ハンバーガーメニュー */}
        <div className={styles.humberger} onClick={toggleHumberger}>
          <div className={styles.lines}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        </div>
        <div className={humBackStyle} onClick={toggleHumberger}></div>
        <aside className={humbergerStyle}>
          {openHumberger ? (
            <div className={humbergerNavStyle}>
              <div className={styles.closeHum} onClick={toggleHumberger}>
                close
              </div>
              <nav className={styles.humNav}>
                <ul className={styles.humUl}>
                  <li className={styles.humLi}>
                    <Link href='/header/about'>
                      <a className={styles.humString}>About</a>
                    </Link>
                  </li>
                  <li className={styles.humLi}>
                    <Link href='/header/help'>
                      <a className={styles.humString}>Help</a>
                    </Link>
                  </li>
                  <li className={styles.humLi}>
                    <span className={styles.humString} onClick={logOut}>
                      ログアウト
                    </span>
                  </li>
                </ul>
              </nav>
            </div>
          ) : null}
        </aside>
      </header>

      {/* 検索欄 */}
      <form className={styles.serch} onSubmit={stopSubmit}>
        <input
          className={styles.serchInput}
          type='search'
          value={searchWord}
          placeholder='食材を検索'
          onChange={inputSearchWord}
        />
      </form>

      {/* ボタン */}
      <div className={styles.buttons}>
        {/* アイテム削除ボタン */}
        <div className={styles.delete} onClick={deleteItem}>
          <Image src='/icon_119870_128.png' height={30} width={30} quality={100} />
        </div>
        {/* アイテム追加ボタン */}
        <div className={styles.add} onClick={toggleAdd}>
          +
        </div>
      </div>

      {/* 各リスト */}
      <main className={styles.lists} id={'scroll-area'} onScroll={scrollMain}>
        <Listsflame
          type='Menu'
          add={addState}
          toggleAdd={toggleAdd}
          userId={userId}
          listData={menuLists}
          allFoodItems={allFoodItems}
          allBuyItems={allBuyItems}
          setAllMenuItems={setAllMenuItems}
          searchWord={searchWord}
          selectedCategory={selectedMenuCategory}
          selectedBuyCategory={selectedBuyCategory}
          deleteItems={deleteMenuItems}
          changeList={changeList}
          selectedList={selectedList}
          changeCategory={changeCategory}
          changeListsState={changeListsState}
        />

        <Listsflame
          type='Food'
          add={addState}
          toggleAdd={toggleAdd}
          userId={userId}
          listData={foodLists}
          allItems={allFoodItems}
          setAllFoodItems={setAllFoodItems}
          searchWord={searchWord}
          searchButton={searchButton}
          selectedCategory={selectedFoodCategory}
          deleteItems={deleteFoodItems}
          changeList={changeList}
          selectedList={selectedList}
          changeCategory={changeCategory}
          changeListsState={changeListsState}
        />

        <Listsflame
          type='Buy'
          add={addState}
          toggleAdd={toggleAdd}
          userId={userId}
          listData={buyLists}
          allItems={allBuyItems}
          setAllBuyItems={setAllBuyItems}
          searchWord={searchWord}
          selectedCategory={selectedBuyCategory}
          selectedFoodCategory={selectedFoodCategory}
          deleteItems={deleteBuyItems}
          changeList={changeList}
          selectedList={selectedList}
          changeCategory={changeCategory}
          changeListsState={changeListsState}
        />
      </main>
    </div>
  )
}
