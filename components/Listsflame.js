import React from 'react'
import { useState } from 'react'
import Category from './Category'
import styles from './Components.module.css'
import Panel from './Panel'

const Listsflame = (props) => {
  let style
  if (props.type === props.selectedList) {
    style = styles.selectedListsContainer
  } else {
    style = styles.listsContainer
  }

  return (
    <div className={style} onClick={() => props.changeList(props.type)}>
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

      {/* 各カテゴリに対応したアイテム */}
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
            categoryId={category.id}
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
