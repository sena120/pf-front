import React from 'react'
import { useState, useEffect } from 'react'
import Category from './Category'
import styles from './Components.module.css'
import Modal from './Modal'
import Panel from './Panel'

const Listsflame = (props) => {
  const [modalState, setModalState] = useState(false)

  //選択されているリストのスタイル
  let style
  if (props.type === props.selectedList) {
    style = styles.selectedListsFlame
  } else {
    style = styles.listsFlame
  }

  //各リストのすべてのアイテムをセットする
  useEffect(() => {
    if (props.type === 'Menu') {
      let allMenu = []
      props.listData.map((category) => {
        allMenu.push.apply(allMenu, category.menuitems)
      })
      props.setAllMenuItems(allMenu)
    } else if (props.type === 'Food') {
      let allFood = []
      props.listData.map((category) => {
        allFood.push.apply(allFood, category.fooditems)
      })
      props.setAllFoodItems(allFood)
    } else if (props.type === 'Buy') {
      let allBuy = []
      props.listData.map((category) => {
        allBuy.push.apply(allBuy, category.buyitems)
      })
      props.setAllBuyItems(allBuy)
    }
  }, [props.listData])

  //モーダルを開閉
  const toggleModal = () => {
    setModalState(!modalState)
  }

  const ModalState = () => {
    if (modalState && props.type === props.selectedList) {
      return (
        <Modal
          type={props.type}
          userId={props.userId}
          listData={props.listData}
          toggleModal={toggleModal}
          changeListsState={props.changeListsState}
        />
      )
    } else {
      useEffect(() => {
        if (props.type !== props.selectedList) {
          setModalState(false)
        }
      }, [props.selectedList])
      return null
    }
  }

  const Loading = () => {
    if (props.listData.length === 0) {
      return <div className={styles.loader}></div>
    }
    return null
  }

  return (
    <div className={style} onClick={() => props.changeList(props.type)}>
      {/* リストのタイトル */}
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>{props.type}</h3>
        <div className={styles.listTools} onClick={toggleModal}>
          ...
        </div>
      </div>

      <ModalState />

      {/* 各リストのカテゴリ */}
      <ul className={styles.tabList}>
        {props.listData.map((category) => {
          return (
            <Category
              key={category.id}
              type={props.type}
              category={category}
              selectedCategory={props.selectedCategory}
              changeCategory={props.changeCategory}
            />
          )
        })}
      </ul>

      <Loading />

      {/* 各カテゴリのアイテム */}
      {props.listData.map((category, index) => {
        let items = []
        if (props.type === 'Menu') {
          items = category.menuitems
        } else if (props.type === 'Food') {
          items = category.fooditems
        } else if (props.type === 'Buy') {
          items = category.buyitems
        }
        return (
          <Panel
            key={index}
            items={items.slice().reverse()}
            add={props.add}
            type={props.type}
            userId={props.userId}
            listData={props.listData}
            allItems={props.allItems}
            allFoodItems={props.allFoodItems}
            allBuyItems={props.allBuyItems}
            categoryId={category.id}
            searchWord={props.searchWord}
            searchButton={props.searchButton}
            deleteItems={props.deleteItems}
            selectedList={props.selectedList}
            selectedCategory={props.selectedCategory}
            selectedBuyCategory={props.selectedBuyCategory}
            selectedFoodCategory={props.selectedFoodCategory}
            changeListsState={props.changeListsState}
          />
        )
      })}
    </div>
  )
}

export default Listsflame
