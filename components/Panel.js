import React from 'react'
import { useState, useEffect } from 'react'
import Item from './Item'
import styles from './Components.module.css'
import AddItem from './AddItem'

const Panel = (props) => {
  let items = props.items

  //検索された食材と一致するMenuアイテムを先頭に持ってくる
  if (props.type === 'Menu' && props.searchWord) {
    const sortItems = []
    const noMutchItems = []

    props.items.map((item) => {
      if (item.foods.includes(props.searchWord)) {
        sortItems.push(item)
      } else {
        noMutchItems.push(item)
      }
    })

    items = sortItems.concat(noMutchItems)
  }

  //アイテムがなかった場合に表示するコンポーネント
  if (props.categoryId === props.selectedCategory) {
    const ExistItems = () => {
      if (props.items.length > 0) {
        return null
      } else {
        return (
          <div className={styles.noExistItems}>
            <p>アイテムがまだありません。</p>
            <p>追加してください。</p>
          </div>
        )
      }
    }

    return (
      <div className={styles.panel} onClick={props.closeModal}>
        <ul className={styles.ul}>
          <AddItem
            items={props.items}
            listData={props.listData}
            add={props.add}
            type={props.type}
            userId={props.userId}
            selectedList={props.selectedList}
            selectedCategory={props.selectedCategory}
            changeListsState={props.changeListsState}
          />
          {items.map((item) => {
            return (
              <Item
                item={item}
                items={props.items}
                key={item.id}
                type={props.type}
                userId={props.userId}
                allItems={props.allItems}
                allFoodItems={props.allFoodItems}
                allBuyItems={props.allBuyItems}
                searchWord={props.searchWord}
                selectedBuyCategory={props.selectedBuyCategory}
                selectedFoodCategory={props.selectedFoodCategory}
                changeListsState={props.changeListsState}
                searchButton={props.searchButton}
                deleteItems={props.deleteItems}
              />
            )
          })}

          <ExistItems />
        </ul>
      </div>
    )
  }
  return null
}

export default Panel
