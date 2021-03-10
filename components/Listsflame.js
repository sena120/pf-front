import React from 'react'
import { useEffect } from 'react'
import Category from './Category'
import styles from './Components.module.css'
import Panel from './Panel'

const Listsflame = (props) => {
  //すべてのFood,Buyアイテムをセットする
  useEffect(() => {
    if (props.type === 'Food') {
      let allFood = []
      props.listData.map((category) => {
        allFood.push.apply(allFood, category.fooditems)
      })
      props.setAllFoodItems(allFood)
    }
    if (props.type === 'Buy') {
      let allBuy = []
      props.listData.map((category) => {
        allBuy.push.apply(allBuy, category.buyitems)
      })
      props.setAllBuyItems(allBuy)
    }
  }, [props.listData])

  //選択されているリストのスタイル
  let style
  if (props.type === props.selectedList) {
    style = styles.selectedListsContainer
  } else {
    style = styles.listsContainer
  }

  return (
    <div className={style} onClick={() => props.changeList(props.type)}>
      {/* リストのheader的な場所 */}
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>{props.type}</h3>
        <div className={styles.listTools}>...</div>
      </div>

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
            allItems={props.allItems}
            categoryId={category.id}
            searchWord={props.searchWord}
            deleteItems={props.deleteItems}
            selectedList={props.selectedList}
            selectedCategory={props.selectedCategory}
            changeListsState={props.changeListsState}
          />
        )
      })}
    </div>
  )
}

export default Listsflame
